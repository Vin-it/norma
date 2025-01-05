export function Errors({ errors }: { errors: string[] }) {
	return (
		<div>
			{errors.map((e) => (
				<p key={e} style={{ color: 'red' }}>
					{e}
				</p>
			))}
		</div>
	);
}
