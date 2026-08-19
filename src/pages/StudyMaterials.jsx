import { useState } from "react";

function StudyMaterials() {
  const [search, setSearch] = useState("");

  const materials = [
    {
      id: 1,
      subject: "Mathematics",
      icon: "📘",
      description: "Algebra, calculus and mathematical concepts.",
      count: 8,
    },
    {
      id: 2,
      subject: "Computer Science",
      icon: "💻",
      description: "Programming, databases and computer fundamentals.",
      count: 12,
    },
    {
      id: 3,
      subject: "Science",
      icon: "🔬",
      description: "Physics, chemistry and biology study materials.",
      count: 6,
    },
    {
      id: 4,
      subject: "English",
      icon: "📖",
      description: "Grammar, vocabulary and communication skills.",
      count: 10,
    },
    {
      id: 5,
      subject: "History",
      icon: "🏛️",
      description: "Important historical events and civilizations.",
      count: 7,
    },
    {
      id: 6,
      subject: "Artificial Intelligence",
      icon: "🤖",
      description: "Machine learning and AI fundamentals.",
      count: 9,
    },
  ];

  const filteredMaterials = materials.filter((material) =>
    material.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="materials-page">

      <div className="materials-header">
        <h1>📚 Study Materials</h1>

        <p>
          Find all your learning resources in one place.
        </p>
      </div>

      <div className="materials-search">
        <input
          type="text"
          placeholder="🔍 Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="materials-grid">

        {filteredMaterials.map((material) => (
          <div className="material-card" key={material.id}>

            <div className="material-icon">
              {material.icon}
            </div>

            <h2>{material.subject}</h2>

            <p>{material.description}</p>

            <span>
              {material.count} materials
            </span>

            <button>
              View Materials
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StudyMaterials;