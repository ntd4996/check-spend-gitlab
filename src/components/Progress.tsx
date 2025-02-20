interface Props {
  loading: boolean
}

export const Progress = ({ loading }: Props) => {
  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 h-1 bg-dark-800/50 backdrop-blur-sm z-50
        transition-transform duration-300 ease-in-out
        ${loading ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-progress"
        style={{ 
          backgroundSize: '200% 100%',
          backgroundPosition: '0 0',
        }}
      />
    </div>
  )
} 