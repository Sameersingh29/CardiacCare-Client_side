import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const CADPatient = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '1', 
    height: '',
    weight: '',
    ap_hi: '', 
    ap_lo: '', 
    cholesterol: '1', 
    gluc: '1', 
    smoke: '0', 
    alco: '0', 
    active: '0', 
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'number' ? parseFloat(value) || '' : parseInt(value) || value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    const processedFormData = {
        age: formData.age,
        gender: parseInt(formData.gender, 10),
        height: formData.height,
        weight: formData.weight,
        ap_hi: formData.ap_hi,
        ap_lo: formData.ap_lo,
        cholesterol: parseInt(formData.cholesterol, 10),
        gluc: parseInt(formData.gluc, 10),
        smoke: parseInt(formData.smoke, 10),
        alco: parseInt(formData.alco, 10),
        active: parseInt(formData.active, 10),
    };

    try {
        const response = await fetch('http://localhost:8000/predict_cardiovascular/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(processedFormData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const result = await response.json();
        setPredictionResult(result);
    } catch (error) {
        console.error('Error submitting form:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="pulse-animation absolute top-10 left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="pulse-animation absolute bottom-10 right-20 w-48 h-48 bg-red-500 rounded-full filter blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-8 relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
          <HeartPulse className="mr-2 text-red-500" /> Patient's Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: 'age', label: 'Age', type: 'number', min: 0, max: 120, required: true },
            { 
              name: 'gender', 
              label: 'Gender', 
              type: 'select', 
              options: { '1': 'Male', '2': 'Female' } 
            },
            { name: 'height', label: 'Height (cm)', type: 'number', min: 50, max: 250, required: true },
            { name: 'weight', label: 'Weight (kg)', type: 'number', min: 10, max: 300, required: true },
            { name: 'ap_hi', label: 'Systolic Blood Pressure', type: 'number', min: 0, max: 300, required: true },
            { name: 'ap_lo', label: 'Diastolic Blood Pressure', type: 'number', min: 0, max: 200, required: true },
            { 
              name: 'cholesterol', 
              label: 'Cholesterol Level', 
              type: 'select', 
              options: { '1': 'Normal', '2': 'Above Normal', '3': 'Well Above Normal' } 
            },
            { 
              name: 'gluc', 
              label: 'Glucose Level', 
              type: 'select', 
              options: { '1': 'Normal', '2': 'Above Normal', '3': 'Well Above Normal' } 
            },
            { 
              name: 'smoke', 
              label: 'Smoking Status', 
              type: 'select', 
              options: { '0': 'No', '1': 'Yes' } 
            },
            { 
              name: 'alco', 
              label: 'Alcohol Intake', 
              type: 'select', 
              options: { '0': 'No', '1': 'Yes' } 
            },
            { 
              name: 'active', 
              label: 'Physical Activity', 
              type: 'select', 
              options: { '0': 'No', '1': 'Yes' } 
            },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required={field.required}
                >
                  {Object.entries(field.options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  min={field.min}
                  max={field.max}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Predicting...' : 'Predict Cardiovascular Risk'}
          </motion.button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-300 rounded">
            <p>{error}</p>
          </div>
        )}

        {predictionResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-900 border border-green-700 text-green-300 rounded"
          >
            <h3 className="font-bold text-lg mb-2">Prediction Result</h3>
            <p>Risk Level: {predictionResult.risk_level}</p>
            {/* {predictionResult.risk_probability && (
              <p>Risk Probability: {predictionResult.risk_probability}%</p>
            )} */}
            {predictionResult.prediction !== undefined && (
              <p>Prediction: {predictionResult.prediction === 1 ? 'High Risk' : 'Low Risk'}</p>
            )}

            <div className="mt-4">
              {predictionResult.prediction === 1 ? (
                <div>
                  <p className="font-bold text-red-400">Recommendations:</p>
                  <ul className="list-disc list-inside">
                    <li><strong>Immediate Action:</strong> Consult a cardiologist or healthcare provider to discuss treatment options.</li>
                    <li><strong>Monitor Blood Pressure:</strong> Regularly track your blood pressure. Aim for a reading below 120/80 mmHg.</li>
                    <li><strong>Dietary Changes:</strong> Reduce sodium intake to less than 2,300 mg per day and include more fruits and vegetables in your meals.</li>
                    <li><strong>Quit Smoking:</strong> If you smoke, seek support to quit immediately.</li>
                    <li><strong>Physical Activity:</strong> Start with 30 minutes of light activity, such as walking, 5 days a week. Consult your doctor before starting any new exercise routine.</li>
                    <li>
                      Learn more about maintaining heart health at 
                      <a href="https://www.heart.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-1">
                        heart.org
                      </a>.
                    </li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-green-400">Recommendations:</p>
                  <ul className="list-disc list-inside">
                    <li><strong>Maintain Your Diet:</strong> Continue eating a balanced diet rich in whole grains, lean proteins, and healthy fats.</li>
                    <li><strong>Stay Active:</strong> Engage in at least 150 minutes of moderate physical activity weekly, such as brisk walking or cycling.</li>
                    <li><strong>Avoid Risk Factors:</strong> Limit alcohol consumption and avoid smoking.</li>
                    <li><strong>Stress Management:</strong> Incorporate mindfulness or relaxation techniques, such as yoga or meditation, into your daily routine.</li>
                    <li>
                      Schedule regular health checkups to keep track of key risk factors like blood pressure and cholesterol levels.
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CADPatient;