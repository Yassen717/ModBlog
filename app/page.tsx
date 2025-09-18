export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Modern Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the latest insights in web development, JavaScript, React, and modern programming techniques.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Read Latest Posts
          </a>
          <a
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            Browse Categories
          </a>
        </div>
      </div>
    </div>
  );
}
