"use client";

import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { DailyChart } from "@/components/charts/DailyChart";
import { getTimeSpentByMonth } from "@/lib/supabase/client";
import { TimeSpent, TimeSpentByMonth } from "@/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Progress } from "@/components/Progress";
import { Skeleton } from "@/components/Skeleton";
import { StatsCard } from "@/components/StatsCard";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dailyData, setDailyData] = useState<TimeSpent[]>([]);
  const [yearMonthlyData, setYearMonthlyData] = useState<TimeSpentByMonth[]>(
    []
  );
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  // Memoize handlers để tránh re-render không cần thiết
  const handlePrevMonth = useCallback(() => {
    if (isDailyLoading) return;
    setDirection("right");
    setIsDailyLoading(true);
    setSelectedDate((prev) => prev.subtract(1, "month"));
  }, [isDailyLoading]);

  const handleNextMonth = useCallback(() => {
    if (isDailyLoading) return;
    setDirection("left");
    setIsDailyLoading(true);
    setSelectedDate((prev) => prev.add(1, "month"));
  }, [isDailyLoading]);

  // Memoize các giá trị được tính toán
  const formattedDate = useMemo(
    () => selectedDate.format("MMMM YYYY"),
    [selectedDate]
  );
  const isLoading = useMemo(
    () => isDailyLoading || isMonthlyLoading,
    [isDailyLoading, isMonthlyLoading]
  );

  // Tách logic fetch data thành các hàm riêng biệt
  const fetchDailyData = useCallback(async (date: dayjs.Dayjs) => {
    try {
      const startOfMonth = date.startOf("month").toISOString();
      const endOfMonth = date.endOf("month").toISOString();

      const { data, error } = await supabase
        .from("time_spent")
        .select(
          "id, user_email, project_id, project_name, issue_id, issue_title, spent_at, time_spent, created_at"
        )
        .gte("spent_at", startOfMonth)
        .lte("spent_at", endOfMonth)
        .order("spent_at", { ascending: true });

      if (error) throw error;

      // Thêm timeout để tạo hiệu ứng mượt mà hơn
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDailyData(data || []);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    } finally {
      setIsDailyLoading(false);
      setDirection(null);
    }
  }, []);

  const fetchYearData = useCallback(async () => {
    try {
      setIsMonthlyLoading(true);
      const currentYear = dayjs().format("YYYY");
      const yearMonthData = await Promise.all(
        Array.from({ length: 12 }, (_, i) => {
          const month = dayjs(`${currentYear}-01-01`).add(i, "month");
          return getTimeSpentByMonth(month.format("YYYY-MM"));
        })
      );
      setYearMonthlyData(yearMonthData.flat());
    } catch (error) {
      console.error("Error fetching year data:", error);
    } finally {
      setIsMonthlyLoading(false);
    }
  }, []);

  // Sử dụng useEffect với dependencies đã được tối ưu
  useEffect(() => {
    fetchDailyData(selectedDate);
  }, [selectedDate, fetchDailyData]);

  useEffect(() => {
    fetchYearData();
  }, [fetchYearData]);

  // Tính toán các thống kê
  const stats = useMemo(() => {
    if (!dailyData.length) return null;

    // Chuyển đổi từ giây sang giờ
    const totalTimeInHours = dailyData.reduce(
      (sum, item) => sum + item.time_spent / 3600,
      0
    );
    const totalTickets = new Set(dailyData.map((item) => item.issue_id)).size;
    const averageTimeInHours = totalTimeInHours / totalTickets;
    const totalIncomeUSD = totalTimeInHours * 7; // $7 per hour
    const totalIncomeVND = totalIncomeUSD * 24500; // 1 USD = 24,500 VND

    return {
      totalTime: `${totalTimeInHours.toFixed(1)}h`,
      totalTickets: totalTickets,
      averageTime: `${averageTimeInHours.toFixed(1)}h`,
      totalIncome: [
        `$${totalIncomeUSD.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        `${totalIncomeVND.toLocaleString("vi-VN")}`,
      ] as [string, string],
    };
  }, [dailyData]);

  return (
    <>
      <Progress loading={isLoading} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-in-top">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent animate-glow">
              Dashboard
            </h1>
            <p className="text-dark-400 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Thời gian làm việc của bạn
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-dark-800/50 backdrop-blur-sm rounded-lg p-2 animate-scale">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-dark-700/50 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous month"
              disabled={isDailyLoading}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium px-4 py-1 rounded-md bg-primary-500/10 capitalize">
              {formattedDate}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-dark-700/50 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next month"
              disabled={isDailyLoading}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isDailyLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-[120px] bg-dark-800/50 backdrop-blur-sm rounded-lg animate-pulse"
                  />
                ))
            : stats && (
                <>
                  <StatsCard
                    title="Tổng thời gian"
                    value={stats.totalTime}
                    type="time"
                    description="Thời gian làm việc trong tháng"
                  />
                  <StatsCard
                    title="Số lượng tickets"
                    value={stats.totalTickets}
                    type="tickets"
                    description="Số tickets đã hoàn thành"
                  />
                  <StatsCard
                    title="Trung bình/ticket"
                    value={stats.averageTime}
                    type="average"
                    description="Thời gian trung bình mỗi ticket"
                  />
                  <StatsCard
                    title="Tổng thu nhập"
                    value={stats.totalIncome}
                    type="income"
                    description={["Dựa trên $7/giờ", "1 USD = 24,500đ"]}
                  />
                </>
              )}
        </div>

        <div className="flex flex-col gap-8">
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-300 transform
                ${
                  isDailyLoading
                    ? direction === "left"
                      ? "-translate-x-full opacity-0"
                      : direction === "right"
                      ? "translate-x-full opacity-0"
                      : ""
                    : direction === "left"
                    ? "translate-x-0"
                    : direction === "right"
                    ? "translate-x-0"
                    : ""
                }
              `}
            >
              {isDailyLoading ? (
                <Skeleton type="daily" />
              ) : (
                <DailyChart data={dailyData} selectedDate={selectedDate} />
              )}
            </div>
          </div>

          <div className="animate-slide-in-bottom [animation-delay:200ms]">
            {isMonthlyLoading ? (
              <Skeleton type="monthly" />
            ) : (
              <MonthlyChart data={yearMonthlyData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
