import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: '60vh' }}
  >
    <div className="text-center">
      <p className="text-white bg-danger p-3 rounded">
        {message}
      </p>
    </div>
  </div>
);

export default ErrorMessage;
