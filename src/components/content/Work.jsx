import React from 'react'

const Work = () => {
  return (
    <div>
      <div className='inline-block bg-orange-200 border-2 border-orange-950 px-4 py-1 mb-2 font-bold text-2xl shadow-sm'>WORK EXPERIENCE</div>
      <div className='text-l text-left px-2 pt-4 space-y-6 pb-8'> 
        
        {/* Sony PlayStation */}
        <div>
          <p className='text-xl font-bold border-2 border-orange-950 bg-orange-100 pl-2 shadow-sm'>Sony Interactive Entertainment (PlayStation)</p>
          <div className='pt-4 pl-2'>
              <p className='grid grid-cols-2'> <span className='text-lg font-bold underline underline-offset-4 decoration-orange-800/50'>Software Engineer Intern | Voice & Agent Team</span> <span className='italic font-semibold text-right'>May 2025 – Aug 2025</span></p>
              <ul className='space-y-2 list-none pt-3'>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Designed a custom entity-resolution engine in Google Dialogflow CX to handle 10,000+ game titles and niche gaming terminology, improving voice assistant intent classification accuracy.</span></li>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Built an automated GCP cost-tracking pipeline integrating BigQuery with an Angular & Go application on AWS EKS.</span></li>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Built custom federated identity logic from scratch to authenticate the AWS EKS app with GCP.</span></li>
              </ul>
          </div>
        </div>

        {/* GE HealthCare */}
        <div>
          <p className='text-xl font-bold border-2 border-orange-950 bg-orange-100 pl-2 shadow-sm'>GE HealthCare</p>
          <div className='pt-4 pl-2'>
              <p className='grid grid-cols-2'> <span className='text-lg font-bold underline underline-offset-4 decoration-orange-800/50'>Software Engineer 2</span> <span className='italic font-semibold text-right'>July 2021 – July 2024</span></p>
              <ul className='space-y-2 list-none pt-3'>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Researched and filed a patent application on an ML-based anomaly detection system to identify security and operational anomalies in medical imaging devices.</span></li>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Designed and improved PaaS components for a high-availability edge computing platform in hospital environments.</span></li>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Enhanced Distributed Logging (Fluent Bit/Fluentd) by integrating an ingestion API and implementing log exclusion and multiline parsing, reducing redundant log volume by 15%.</span></li>
                <li><span className="text-orange-800 mr-2 flex-shrink-0">▶</span><span>Improved reliability of a Flexera license management service (Go REST API & AWS Lambda) by automating integration tests in GitLab CI.</span></li>
              </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Work