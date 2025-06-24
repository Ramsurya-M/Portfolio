'use client'

const Footer = () => {

  return (
    <footer className="w-full py-6 px-4 mt-auto bg-orange-400 dark:bg-orange-400 border-t border-black-900 dark:border-black-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-black dark:text-black">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-black hover:text-gray-900 dark:text-black dark:hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-black hover:text-gray-900 dark:text-black dark:hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-black hover:text-gray-900 dark:text-black dark:hover:text-white transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
