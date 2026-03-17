import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { artifacts } from '../data/mock-data';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

const verificationChecklist = [
  { id: 'schema', label: 'Schema matches canonical definition', checked: true },
  { id: 'pii', label: 'No PII leakage', checked: true },
  { id: 'owner', label: 'Owner assigned', checked: true },
  { id: 'tests', label: 'Test coverage present', checked: false },
  { id: 'performance', label: 'Performance under threshold', checked: true },
];

export function VerificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(verificationChecklist);
  
  const artifact = artifacts.find((a) => a.id === id) || artifacts[1]; // Default to unverified artifact

  const handleChecklistChange = (itemId: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleApprove = () => {
    toast.success('Asset verified and added to ingest queue');
    setTimeout(() => navigate('/admin/telemetry'), 1000);
  };

  const handleRequestChanges = () => {
    toast.info('Verification rejected. Owner has been notified.');
    setTimeout(() => navigate('/'), 1000);
  };

  const allChecked = checklist.every((item) => item.checked);

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900 mb-2">Asset Verification</h1>
              <p className="text-gray-600">Review and approve asset for organizational use</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Asset Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base text-gray-900 mb-1">{artifact.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{artifact.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Owner: {artifact.owner}</span>
              <span>•</span>
              <span>Created: {artifact.created}</span>
              <span>•</span>
              <span>Type: {artifact.type}</span>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg text-gray-900 mb-4">Verification Checklist</h2>
          <div className="space-y-4">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => handleChecklistChange(item.id)}
                />
                <Label
                  htmlFor={item.id}
                  className="text-sm cursor-pointer flex-1"
                >
                  {item.label}
                </Label>
                {item.checked ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PII Scan Results */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg text-gray-900 mb-4">PII Scan Results</h2>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>No PII detected in query or results</span>
          </div>
        </div>

        {/* Automated Tests */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg text-gray-900 mb-4">Automated Test Results</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Schema validation: <span className="text-green-600">PASS</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Performance test: <span className="text-green-600">PASS</span> (2.3s)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-700">Test coverage: <span className="text-yellow-600">PARTIAL</span> (67%)</span>
            </div>
          </div>
        </div>

        {/* SQL Preview */}
        {artifact.sql && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg text-gray-900 mb-4">SQL Query</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {artifact.sql}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleRequestChanges}
          >
            Request Changes
          </Button>
          <Button
            style={{ backgroundColor: '#FF3A00' }}
            className="text-white"
            onClick={handleApprove}
            disabled={!allChecked}
          >
            Approve & Verify
          </Button>
        </div>

        {!allChecked && (
          <p className="text-sm text-yellow-700 text-right mt-2">
            Complete all checklist items to approve
          </p>
        )}
      </div>
    </div>
  );
}
