export default function(color) {
	switch (color) {
		case 'copper': return 'rgb(206 19 0)'
		case 'bronze': return '#86602c'
		case 'silver': return '#969696'
		case 'gold' : return '#f4d91c'
		case 'platinum' : return '#58cdc1'
		case 'emerald' : return '#46cf4f'
		case 'diamond' : return '#b614ca'
		case 'champion' : return 'rgb(255 0 75)'
		default: return 'inherit'
	};
}