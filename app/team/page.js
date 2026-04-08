const teamMembers = [
  { name: "Sumit Chaturvedi", roll: "221MN052" },
  { name: "Aditya Anshul", roll: "221MN004" },
  { name: "Sushma", roll: "221MN054" },
];

export default function TeamPage() {
  return (
    <section className="content-section">
      <div className="container">
        <h1>Team Members</h1>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.roll}>
              <h3>{member.name}</h3>
              <p className="roll-number">{member.roll}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
