import React, { useState } from 'react';

function ExpandirConteudo(props) {
  // Define a state variable to track the visibility of the table
  const [isTableVisible, setIsTableVisible] = useState(false);

  // Function to toggle the visibility of the table
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <>
      {/* Button to toggle the table */}
      <button  className='alignElementCenter' onClick={toggleTableVisibility}>
        {isTableVisible ? 'Ver menos' : props.texto}
      </button>

      {/* Conditional rendering of the table based on visibility */}
      {isTableVisible && (
        <props.componente/>
      )}
    </>
  );
}

export default ExpandirConteudo;
