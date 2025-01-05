export function Errors({ errors }: { errors: string[] }) {
	return (
		<span>
			{errors.map((e) => (
				<span key={e} style={{ color: 'red' }}>
					<b>{e}</b>
				</span>
			))}
		</span>
	);
}
