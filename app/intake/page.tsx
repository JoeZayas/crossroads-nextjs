'use client';

import { useState } from 'react';

export default function Intake() {
  const [submitted, setSubmitted] = useState(false);
  const [showMATFields, setShowMATFields] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-green-50 border-2 border-green-600 p-8 rounded-xl text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Thank You for Your Submission!</h1>
          <p className="text-lg text-gray-700 mb-4">
            We have received your intake questionnaire and will review it carefully. A member of our team will contact you within 24-48 hours to discuss next steps.
          </p>
          <p className="text-gray-600">
            If you need immediate assistance, please <a href="tel:+15073981970" className="text-emerald-600 font-semibold">call us</a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Intake Questionnaire</h1>
          <p className="text-xl text-blue-100">All information is confidential</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
          <p className="text-lg text-gray-700">
            <strong>Important:</strong> All information provided is confidential and will be used solely for admission consideration and program planning. Please answer all questions honestly and completely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-12">
          
          {/* Personal Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                <input type="text" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                <input type="text" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                <input type="date" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                <input type="tel" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                <input type="email" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Current Address</label>
                <textarea rows={2} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Emergency Contact Name *</label>
                <input type="text" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Emergency Contact Phone *</label>
                <input type="tel" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
            </div>
          </section>

          {/* Recovery History */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Recovery History</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Clean/Sober Date (if applicable)</label>
                <input type="date" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Please describe your substance use history *</label>
                <textarea required rows={4} placeholder="Include primary substances used, duration of use, and any patterns" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Have you completed any treatment programs? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No prior treatment</option>
                  <option>Outpatient only</option>
                  <option>Inpatient/Residential</option>
                  <option>Both inpatient and outpatient</option>
                  <option>Detox only</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">If yes, please provide details about your treatment history</label>
                <textarea rows={3} placeholder="Include facility names, dates, and completion status" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* MAT Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Medication Assisted Treatment (MAT)</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Are you currently on Medication Assisted Treatment (MAT)? *</label>
                <select 
                  required 
                  onChange={(e) => setShowMATFields(e.target.value === 'yes')}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="planning">No, but planning to start</option>
                </select>
              </div>
              {showMATFields && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Which medication? *</label>
                    <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                      <option value="">Select...</option>
                      <option>Methadone</option>
                      <option>Buprenorphine (Suboxone/Subutex)</option>
                      <option>Naltrexone (Vivitrol)</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">MAT Provider/Clinic Name</label>
                    <input type="text" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Dosage</label>
                    <input type="text" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Medical & Mental Health */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Medical & Mental Health</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Do you have any medical conditions we should be aware of?</label>
                <textarea rows={3} placeholder="List any chronic conditions, allergies, or ongoing medical concerns" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Are you currently taking any medications (other than MAT)?</label>
                <textarea rows={3} placeholder="List all current medications and dosages" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Have you been diagnosed with any mental health conditions? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No diagnosis</option>
                  <option>Yes (specify below)</option>
                  <option>Unsure/Under evaluation</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">If yes, please describe</label>
                <textarea rows={3} placeholder="Include diagnoses and current treatment" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Are you currently experiencing suicidal thoughts? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No</option>
                  <option>Yes</option>
                  <option>Sometimes</option>
                </select>
                <p className="text-sm text-gray-600 italic mt-2">If you are experiencing a mental health crisis, please call 988 (Suicide & Crisis Lifeline) immediately.</p>
              </div>
            </div>
          </section>

          {/* Legal & Employment */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Legal & Employment</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Do you have any pending legal matters? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No pending legal matters</option>
                  <option>On probation/parole</option>
                  <option>Pending court cases</option>
                  <option>Both probation and pending cases</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">If yes, please provide details</label>
                <textarea rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Current Employment Status *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Employed full-time</option>
                  <option>Employed part-time</option>
                  <option>Unemployed, actively seeking</option>
                  <option>Unemployed, not currently seeking</option>
                  <option>Disabled</option>
                  <option>Student</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What are your employment goals?</label>
                <textarea rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Financial Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Financial Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Current source of income *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Employment</option>
                  <option>Disability benefits</option>
                  <option>Unemployment benefits</option>
                  <option>Family support</option>
                  <option>Savings</option>
                  <option>No current income</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Can you pay monthly house fees? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Yes</option>
                  <option>Partially</option>
                  <option>No, need assistance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What are your long-term housing goals? *</label>
                <textarea required rows={3} placeholder="E.g., save for apartment, work toward home ownership, stable rental, etc." className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Goals & Motivation */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Goals & Motivation</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Why do you want to live at Crossroads Sober Living? *</label>
                <textarea required rows={4} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What are your primary recovery goals? *</label>
                <textarea required rows={4} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What challenges do you anticipate in maintaining your sobriety?</label>
                <textarea rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What support do you need to be successful at Crossroads?</label>
                <textarea rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* References */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">References</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">How did you hear about Crossroads? *</label>
                <select required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Treatment center</option>
                  <option>Therapist/Counselor</option>
                  <option>Friend/Family</option>
                  <option>Online search</option>
                  <option>Social media</option>
                  <option>Probation officer</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Professional Reference #1 (Name)</label>
                <input type="text" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input type="tel" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Relationship</label>
                  <input type="text" placeholder="e.g., counselor, sponsor" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Agreement</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I certify that the information provided in this questionnaire is true and complete to the best of my knowledge. *</span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I understand that admission to Crossroads Sober Living is subject to review and acceptance of the house guidelines and contract. *</span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I authorize Crossroads to conduct a background check if necessary. *</span>
              </label>
            </div>
          </section>

          <div className="text-center pt-6">
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Submit Intake Form
            </button>
            <p className="text-sm text-gray-500 mt-4">* Required fields</p>
          </div>
        </form>
      </div>
    </main>
  );
}
