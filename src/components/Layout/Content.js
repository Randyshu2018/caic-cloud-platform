import React from 'react';

export default function Content({ children }) {
  return (
    <div
      style={{
        minHeight: 200,
        backgroundColor: '#fff',
        width: '100%',
        padding: 30,
        marginTop: 30,
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}
