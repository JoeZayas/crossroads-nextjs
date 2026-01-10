'use client';

export default function Contract() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">House Guidelines & Resident Contract</h1>
          <p className="text-xl text-blue-100 mb-6">Clear expectations for a supportive recovery environment</p>
          <a 
            href="/assets/documents/Crossroads_Contract.pdf" 
            download
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Download PDF Contract
          </a>
        </div>
      </div>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl mb-8">
            <p className="text-lg"><strong>Important Notice:</strong> All residents must read, understand, and agree to these guidelines before admission.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <iframe 
              src="/assets/documents/Crossroads_Contract.pdf" 
              className="w-full h-[800px] border-2 border-gray-300 rounded-lg"
              title="Resident Contract"
            />
          </div>

          <div className="text-center space-x-4">
            <a 
              href="/contact" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Proceed to Intake Form
            </a>
            <button 
              onClick={() => window.print()}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
            >
              Print Guidelines
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
