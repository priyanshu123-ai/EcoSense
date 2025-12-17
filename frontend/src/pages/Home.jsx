import React from 'react';

const Home = () => {
  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 30px rgba(29, 185, 84, 0.3); }
      50% { box-shadow: 0 0 60px rgba(29, 185, 84, 0.5); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
    

      <div className="min-h-screen bg-[linear-gradient(180deg,#0c1210_0%,#060908_100%)] text-[#f0f5f2]">
          <style>{keyframes}</style>
        Home
      </div>
    </>
  );
};

export default Home;
