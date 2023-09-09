import { Fragment } from "react"
import logo from '../assets/1eye.svg'



const Loading = () => {
  return (
    <Fragment>
    <div className='flex flex-col h-screen items-center justify-center w-screen'>
      {/* <img
        src={spinner}
        alt='Loading...'
        style={{ width: '64px', margin: 'auto', display: 'block' }}
      /> */}
      <img 
      className="w-auto h-48"
      src={logo} alt='Loading' />
      <h1 className='flex flex-row'>Loading..</h1>
    </div>
  </Fragment>
  )
}

export default Loading