const aboutSections = [
  {
    title: "Abstract",
    content:
      "The project presents a semi-empirical, computation-aided approach to design roof-bolt support for underground coal mine galleries and junctions. It links rock mass classification (RMR/Q) with simplified CMRI-ISM style rock-load relations and translates them into a transparent calculator, aiming for safe, economical, and field-friendly design guidance.",
  },
  {
    title: "Problem Statement",
    content:
      "Roof instability and roof-falls are leading hazards in Indian underground coal mines, especially in galleries and stress-amplifying junctions. Prescriptive support rules may be non-optimal across variable geology, causing either under-support or over-support. A site-aware, semi-empirical workflow is needed to relate measured inputs to support density and bolt spacing.",
  },
];

export default function AboutPage() {
  return (
    <section className="content-section">
      <div className="container">
        <h1>About the Project</h1>
        {aboutSections.map((section) => (
          <div className="card content-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
