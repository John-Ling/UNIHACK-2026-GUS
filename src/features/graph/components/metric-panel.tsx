interface MetricPanelProps {
  depthLevel: number;

}

export default function MetricPanel({depthLevel}: MetricPanelProps) {
  return (
    <div className="p-2">
      <p className="font-jet">DEPTH LEVEL: {depthLevel}</p>
    </div>
  )
}


