import React from 'react';
import { Oval } from 'react-loader-spinner';

export default function Loader({ loading, label }: { loading: boolean; label: string | React.ReactNode }) {
  return loading ? <Oval width={25} height={25} color="#fff" secondaryColor="#f0f0f0" /> : <>{label}</>;
}
