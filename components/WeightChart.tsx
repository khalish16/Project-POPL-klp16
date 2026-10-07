'use client';
import {Line} from 'react-chartjs-2';import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Tooltip,Legend} from 'chart.js';ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Tooltip,Legend);
export default function WeightChart({labels,data}:{labels:string[];data:number[]}){return <Line data={{labels,datasets:[{label:'Berat (kg)',data,borderWidth:2,tension:.35}]}} options={{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:false}}}}/>}
