import React from 'react';

const Legend: React.FC = () => {
  const categories = [
    { name: 'Nonmetal', color: 'bg-nonmetal' },
    { name: 'Noble Gas', color: 'bg-noble-gas' },
    { name: 'Alkali Metal', color: 'bg-alkali-metal' },
    { name: 'Alkaline Earth Metal', color: 'bg-alkaline-earth-metal' },
    { name: 'Metalloid', color: 'bg-metalloid' },
    { name: 'Post-Transition Metal', color: 'bg-post-transition-metal' },
    { name: 'Transition Metal', color: 'bg-transition-metal' },
    { name: 'Halogen', color: 'bg-halogen' },
    { name: 'Actinide', color: 'bg-actinide' },
    { name: 'Lanthanide', color: 'bg-lanthanide' },
  ];

  return (
    <div className="my-8 px-4">
      <h2 className="text-xl font-bold mb-4">Legend</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div key={category.color} className="flex items-center">
            <div className={`w-4 h-4 mr-2 ${category.color} rounded`}></div>
            <span className="text-sm">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;