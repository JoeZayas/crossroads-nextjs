'use client';

import { useState } from 'react';

export default function Intake() {
  const [submitted, setSubmitted] = useState(false);
  const [showMATFields, setShowMATFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      // Convert FormData to a plain object
      const data = {
        // Personal Information
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        dateOfBirth: formData.get('dateOfBirth') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        email: formData.get('email') as string,
        address: formData.get('address') as string,
        emergencyContactName: formData.get('emergencyContactName') as string,
        emergencyContactPhone: formData.get('emergencyContactPhone') as string,

        // Recovery History
        soberDate: formData.get('soberDate') as string,
        substanceHistory: formData.get('substanceHistory') as string,
        treatmentPrograms: formData.get('treatmentPrograms') as string,
        treatmentDetails: formData.get('treatmentDetails') as string,

        // MAT Information
        onMAT: formData.get('onMAT') as string,
        matMedication: formData.get('matMedication') as string,
        matProvider: formData.get('matProvider') as string,
        matDosage: formData.get('matDosage') as string,

        // Medical & Mental Health
        medicalConditions: formData.get('medicalConditions') as string,
        currentMedications: formData.get('currentMedications') as string,
        mentalHealthDiagnosis: formData.get('mentalHealthDiagnosis') as string,
        mentalHealthDetails: formData.get('mentalHealthDetails') as string,
        suicidalThoughts: formData.get('suicidalThoughts') as string,

        // Legal & Employment
        legalMatters: formData.get('legalMatters') as string,
        legalDetails: formData.get('legalDetails') as string,
        employmentStatus: formData.get('employmentStatus') as string,
        employmentGoals: formData.get('employmentGoals') as string,

        // Financial Information
        incomeSource: formData.get('incomeSource') as string,
        canPayFees: formData.get('canPayFees') as string,
        housingGoals: formData.get('housingGoals') as string,

        // Goals & Motivation
        whyCrossroads: formData.get('whyCrossroads') as string,
        recoveryGoals: formData.get('recoveryGoals') as string,
        anticipatedChallenges: formData.get('anticipatedChallenges') as string,
        supportNeeded: formData.get('supportNeeded') as string,

        // References
        howHeardAbout: formData.get('howHeardAbout') as string,
        reference1Name: formData.get('reference1Name') as string,
        reference1Phone: formData.get('reference1Phone') as string,
        reference1Relationship: formData.get('reference1Relationship') as string,

        // Agreement
        certifyTruth: formData.get('certifyTruth') === 'on',
        understandGuidelines: formData.get('understandGuidelines') === 'on',
        authorizeBackgroundCheck: formData.get('authorizeBackgroundCheck') === 'on',
      };

      // Submit to API
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-12">
          
          {/* Personal Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                <input type="text" name="firstName" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                <input type="text" name="lastName" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                <input type="date" name="dateOfBirth" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                <input type="tel" name="phoneNumber" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                <input type="email" name="email" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Current Address</label>
                <textarea name="address" rows={2} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Emergency Contact Name *</label>
                <input type="text" name="emergencyContactName" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Emergency Contact Phone *</label>
                <input type="tel" name="emergencyContactPhone" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
            </div>
          </section>

          {/* Recovery History */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Recovery History</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Clean/Sober Date (if applicable)</label>
                <input type="date" name="soberDate" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Please describe your substance use history *</label>
                <textarea name="substanceHistory" required rows={4} placeholder="Include primary substances used, duration of use, and any patterns" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Have you completed any treatment programs? *</label>
                <select name="treatmentPrograms" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
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
                <textarea name="treatmentDetails" rows={3} placeholder="Include facility names, dates, and completion status" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
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
                  name="onMAT"
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
                    <select name="matMedication" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                      <option value="">Select...</option>
                      <option>Methadone</option>
                      <option>Buprenorphine (Suboxone/Subutex)</option>
                      <option>Naltrexone (Vivitrol)</option>
                      <option>Medical Marijuana</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">MAT Provider/Clinic Name</label>
                    <input type="text" name="matProvider" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Dosage</label>
                    <input type="text" name="matDosage" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
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
                <textarea name="medicalConditions" rows={3} placeholder="List any chronic conditions, allergies, or ongoing medical concerns" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Are you currently taking any medications (other than MAT)?</label>
                <textarea name="currentMedications" rows={3} placeholder="List all current medications and dosages" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Have you been diagnosed with any mental health conditions? *</label>
                <select name="mentalHealthDiagnosis" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No diagnosis</option>
                  <option>Yes (specify below)</option>
                  <option>Unsure/Under evaluation</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">If yes, please describe</label>
                <textarea name="mentalHealthDetails" rows={3} placeholder="Include diagnoses and current treatment" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Are you currently experiencing suicidal thoughts? *</label>
                <select name="suicidalThoughts" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
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
                <select name="legalMatters" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>No pending legal matters</option>
                  <option>On probation/parole</option>
                  <option>Pending court cases</option>
                  <option>Both probation and pending cases</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">If yes, please provide details</label>
                <textarea name="legalDetails" rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Current Employment Status *</label>
                <select name="employmentStatus" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
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
                <textarea name="employmentGoals" rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Financial Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Financial Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Current source of income *</label>
                <select name="incomeSource" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
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
                <select name="canPayFees" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Yes</option>
                  <option>Partially</option>
                  <option>No, need assistance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What are your long-term housing goals? *</label>
                <textarea name="housingGoals" required rows={3} placeholder="E.g., save for apartment, work toward home ownership, stable rental, etc." className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Goals & Motivation */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Goals & Motivation</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Why do you want to live at Crossroads Sober Living? *</label>
                <textarea name="whyCrossroads" required rows={4} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What are your primary recovery goals? *</label>
                <textarea name="recoveryGoals" required rows={4} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What challenges do you anticipate in maintaining your sobriety?</label>
                <textarea name="anticipatedChallenges" rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">What support do you need to be successful at Crossroads?</label>
                <textarea name="supportNeeded" rows={3} className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* References */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">References</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">How did you hear about Crossroads? *</label>
                <select name="howHeardAbout" required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none">
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
                <input type="text" name="reference1Name" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input type="tel" name="reference1Phone" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Relationship</label>
                  <input type="text" name="reference1Relationship" placeholder="e.g., counselor, sponsor" className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-600">Agreement</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" name="certifyTruth" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I certify that the information provided in this questionnaire is true and complete to the best of my knowledge. *</span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" name="understandGuidelines" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I understand that admission to Crossroads Sober Living is subject to review and acceptance of the house guidelines and contract. *</span>
              </label>
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" name="authorizeBackgroundCheck" required className="mt-1 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">I authorize Crossroads to conduct a background check if necessary. *</span>
              </label>
            </div>
          </section>

          <div className="text-center pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
            </button>
            <p className="text-sm text-gray-500 mt-4">* Required fields</p>
          </div>
        </form>
      </div>
    </main>
  );
}
