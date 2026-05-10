'use client';

import { useState } from 'react';
import Step1Details from '../../components/inspection/Step1Details';
import Step2Hazard from '../../components/inspection/Step2Hazard';
import Step3Risk from '../../components/inspection/Step3Risk';
import Step4Review from '../../components/inspection/Step4Review';
import ProgressBar from '../../components/inspection/ProgressBar';

export default function InspectionFlow() {
  const [step, setStep] = useState(1);

  const [report, setReport] = useState({
    company: '',
    location: '',
    inspector: '',
    date: '',
    confidential: false,
  });

  const [findings, setFindings] = useState<any[]>([]);

  const [current, setCurrent] = useState({
    hazard: '',
    probability: '',
    severity: '',
    standard: '',
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const addFinding = () => {
    setFindings([...findings, current]);
    setCurrent({
      hazard: '',
      probability: '',
      severity: '',
      standard: '',
    });
    setStep(2);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <ProgressBar step={step} />

      {step === 1 && (
        <Step1Details
          data={report}
          setData={setReport}
          next={next}
        />
      )}

      {step === 2 && (
        <Step2Hazard
          data={current}
          setData={setCurrent}
          next={next}
          back={back}
        />
      )}

      {step === 3 && (
        <Step3Risk
          data={current}
          setData={setCurrent}
          next={addFinding}
          back={back}
        />
      )}

      {step === 4 && (
        <Step4Review
          findings={findings}
          report={report}
          back={() => setStep(2)}
        />
      )}
    </div>
  );
}
