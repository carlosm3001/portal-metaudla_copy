import TeamCard from "../TeamCard";

export default function TeamGrid({ members=[] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map(m => <TeamCard key={m.email} {...m} />)}
    </section>
  );
}
