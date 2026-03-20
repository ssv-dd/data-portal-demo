import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import workflowsPlaceholder from 'figma:asset/4282569dbbcc632371c7dd5f1ae911a437274136.png';

export function AIWorkflowsPage() {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <ImageWithFallback
        src={workflowsPlaceholder}
        alt="AI Workflows - Existing Product"
        className="w-full h-auto"
      />
    </div>
  );
}