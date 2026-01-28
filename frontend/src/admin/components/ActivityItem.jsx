export default function ActivityItem({ text, time }) {
  return (
    <div className="flex justify-between text-sm py-2">
      <span>{text}</span>
      <span className="text-[#9CA3AF]">{time}</span>
    </div>
  );
}
