import React from 'react';

export default function Spinner(props: React.HTMLProps<HTMLDivElement>) {
  return <i className="fas fa-spinner-third animate-spin" {...props} />;
}
