import React, {
	useState,
	useEffect,
	useRef,
	TextareaHTMLAttributes,
} from "react";

const AutoTextArea = ({
	disabled,
	onChange,
	value
  }) => {
	const textAreaRef = useRef(null);
	const [text, setText] = useState("");
	const [textAreaHeight, setTextAreaHeight] = useState("auto");
	const [parentHeight, setParentHeight] = useState("auto");;
	const [minHeight, setMinHeight] = useState(0)

	useEffect(() => {
		setParentHeight(`${minHeight}px`);
		setTextAreaHeight(`${minHeight}px`);
	}, [value]);

	const onChangeHandler = (event) => {
		// setText(event.target.value);
		// value = event.target.value;
		if(textAreaRef.current.scrollHeight > minHeight)
		{
			setMinHeight( textAreaRef.current.scrollHeight);
			setTextAreaHeight(minHeight); // Resets width of container. 
			setParentHeight(`${minHeight}px`);
			
		}

		if (onChange) {
			onChange(event);
		}
	};

	return (
		<div
			style={{
				minHeight: parentHeight,
			}}
		>
			<textarea className="form-control"
				// {...props}
				ref={textAreaRef}
				rows={1}
				style={{
					height: textAreaHeight,
				}}
				value={value}
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default AutoTextArea;