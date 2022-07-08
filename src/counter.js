import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Counter() {
  const navigate = useNavigate()

  let timer
  const [count, setCount] = useState(60)

  const updateCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setCount((prevCount) => prevCount - 1)
      }, 1000)

    if (count === 0) {
      clearInterval(timer)
      navigate('/')
    }
  }

  useEffect(() => {
    updateCount()

    return () => clearInterval(timer)
  }, [count])

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <br />
            <div className='ticket-visual_ticket-number font-right'>Counter</div>
            <br />
            <br />
          </div>
          <div className='ticket-visual_ticket-number-wrapper fields justify-center'>
            <div className='ticket-visual_ticket-number bold'>{count}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Counter
