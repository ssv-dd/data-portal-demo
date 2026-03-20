import { useState } from 'react';
import { Button } from '../components/ui/button';
import { RefreshCw, Database, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { telemetryEvents, telemetryKPIs } from '../data/mock-data';
import { toast } from 'sonner';

export function TelemetryPage() {
  const [events, setEvents] = useState(telemetryEvents);

  const handleTriggerRetrain = () => {
    toast.success('Retrain started — job id: r-20260310-01');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl text-gray-900 mb-2">Telemetry & Ingest Monitor</h1>
              <p className="text-gray-600">
                Monitor asset ingestion, verification queue, and AI model retraining
              </p>
            </div>
            <Button
              style={{ backgroundColor: '#FF3A00' }}
              className="text-white gap-2"
              onClick={handleTriggerRetrain}
            >
              <RefreshCw className="w-4 h-4" />
              Trigger Retrain
            </Button>
          </div>

          {/* KPI Tiles */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">Last Ingest</div>
              <div className="text-2xl text-gray-900">{telemetryKPIs.lastIngest}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">Retrain Queue</div>
              <div className="text-2xl text-gray-900">{telemetryKPIs.retrainQueueLength} items</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">Verified Assets</div>
              <div className="text-2xl text-gray-900">{telemetryKPIs.verifiedAssetsCount}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">Hallucination Rate</div>
              <div className="text-2xl text-gray-900">{telemetryKPIs.hallucinations}</div>
              <div className="text-xs text-gray-500 mt-1">user reported</div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              Last ingest: {telemetryKPIs.lastIngest} • Retrain queue: {telemetryKPIs.retrainQueueLength} items • Last verified asset: {telemetryKPIs.lastVerifiedAsset} (verified by {telemetryKPIs.lastVerifiedBy})
            </p>
          </div>

          {/* Event Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg text-gray-900">Recent Events</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-700">Time</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700">Artifact</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700">Owner</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700">Log Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(event.time).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{event.artifact}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.owner}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(event.status)}
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                        {event.log}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Queue Details */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg text-gray-900">Retrain Queue</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">orders_by_city.sql</span>
                <span className="text-xs text-gray-500">Position: 1</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">delivery_latency_by_zone.sql</span>
                <span className="text-xs text-gray-500">Position: 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
