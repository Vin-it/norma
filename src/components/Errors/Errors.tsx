export function Errors({ errors }: { errors: string[] }) {
	return (
		<div>
			{errors.map((e) => (
				<span key={e} style={{ color: 'red' }}>
					<b>{e}</b>
				</span>
			))}
		</div>
	);
}
