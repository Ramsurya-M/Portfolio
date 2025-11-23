import React from 'react'

const Contact = () => {
  return (
    <div>
<div className="flex flex-col items-center justify-center pb-20">
  <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
  <a href="mailto:ramsurya2614@gmail.com" className="text-blue-500 hover:text-blue-700">
    ramsurya2614@gmail.com
  </a>
<a 
  href="/Resume.pdf" 
  target="_blank" 
  rel="noopener noreferrer"
  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
>
  Resume
</a>
</div>
    </div>
  )
}

export default Contact