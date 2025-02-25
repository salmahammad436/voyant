interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
	return (
		<div className="flex flex-col gap-3">
			{label && <label className="text-gray-700 font-medium">{label}</label>}
			<input
				className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
				{...props}
			/>
		</div>
	);
};

export default Input;
