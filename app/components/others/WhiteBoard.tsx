import React, { useState, useRef } from "react";
// import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
// import Erase from '../../../icons/whiteboard/erase.svg'
// import Star from '../../../icons/whiteboard/star.svg';
// import Download from '../../../icons/whiteboard/download.svg';
// import { Box, Menu, MenuItem, Typography, useTheme } from "@mui/material";
// import { mdiSwordCross } from "@mdi/js";
// import Icon from "@mdi/react";

// interface LineType {
//     tool: string;
//     points: number[];
//     color: string;
//     strokeWidth: number;
//     id: string;
// }

// interface ShapeType {
//     tool: string;
//     x: number;
//     y: number;
//     width?: number;
//     height?: number;
//     radius?: number;
//     cornerRadius?: number;
//     points?: number[];
//     color: string;
//     fillColor: string;
//     strokeWidth: number;
//     id: string;
// }

interface Action {
    handleWhiteBoardClose: () => void;
    setDrawImage: (image: string | null) => void;
}

// interface TextType {
//     text: string;
//     x: number;
//     y: number;
//     fontSize: number;
//     color: string;
//     id: string;
// }

// const generateId = () => `${Date.now()}-${Math.random()}`;

const WhiteBoard: React.FC<Action> = ({ handleWhiteBoardClose, setDrawImage }) => {
    // const stageRef = useRef<any>(null);
    // const [tool, setTool] = useState<string>("select");
    // const [penTool, setPenTool] = useState<boolean>(true);
    // const [textMode, setTextMode] = useState<boolean>(false);
    // const [eraseMode, setEraseMode] = useState<boolean>(false);
    // const [filled, setFilled] = useState<boolean>(false);
    // const [color, setColor] = useState<string>("#df4b26");
    // const [penWidth, setPenWidth] = useState<number>(5);
    // const [shapeStrokeWidth, setShapeStrokeWidth] = useState<number>(2);
    // const [lines, setLines] = useState<LineType[]>([]);
    // const [shapes, setShapes] = useState<ShapeType[]>([]);
    // const [texts, setTexts] = useState<TextType[]>([]);
    // const [textBoxWidth, setTextBoxWidth] = useState(0);
    // const [selectedId, setSelectedId] = useState<string | null>(null);
    // const [boundingBox, setBoundingBox] = useState<{ x: number, y: number, width: number, height: number, fillColor: string } | null>(null);
    // const [textInput, setTextInput] = useState<string>("");
    // const [textPosition, setTextPosition] = useState<{ x: number, y: number } | null>(null);
    // const isDrawing = useRef<boolean>(false);
    // const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    // const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
    // const [showMenu, setShowMenu] = useState<boolean>(false);

    // const generateRandomString = () => {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // You can add special characters if needed
    //     let result = '';
    //     const charactersLength = characters.length;

    //     for (let i = 0; i < 20; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // };

    // const saveImage = () => {
    //     if (stageRef.current && stageRef.current.getLayers().length > 0) {
    //         const canvas = stageRef.current.getLayers()[0].getCanvas()._canvas;
    //         const width = canvas.width;
    //         const height = canvas.height;
    //         const tempCanvas = document.createElement("canvas");
    //         const tempCtx = tempCanvas.getContext("2d");
    //         if (tempCtx) {
    //             tempCanvas.width = width;
    //             tempCanvas.height = height;
    //             tempCtx.fillStyle = "white";
    //             tempCtx.fillRect(0, 0, width, height);
    //             tempCtx.drawImage(canvas, 0, 0);
    //             const dataURL = tempCanvas.toDataURL("image/jpeg");
    //             const link = document.createElement("a");
    //             link.href = dataURL;
    //             link.download = `${generateRandomString()}.jpg`;
    //             link.click();
    //         } else {
    //             console.error("Failed to get 2D context from the temporary canvas.");
    //         }
    //     } else {
    //         console.error("Stage reference is not valid or has no layers.");
    //     }
    // };

    // const convertImageToBase64 = () => {
    //     if (stageRef.current && stageRef.current.getLayers().length > 0) {
    //         const canvas = stageRef.current.getLayers()[0].getCanvas()._canvas;
    //         const width = canvas.width;
    //         const height = canvas.height;
    //         const tempCanvas = document.createElement("canvas");
    //         const tempCtx = tempCanvas.getContext("2d");
    //         if (tempCtx) {
    //             tempCanvas.width = width;
    //             tempCanvas.height = height;
    //             tempCtx.fillStyle = "white";
    //             tempCtx.fillRect(0, 0, width, height);
    //             tempCtx.drawImage(canvas, 0, 0);
    //             const base64String = tempCanvas.toDataURL("image/jpeg");
    //             return base64String;
    //         } else {
    //             console.error("Failed to get 2D context from the temporary canvas.");
    //         }
    //     } else {
    //         console.error("Stage reference is not valid or has no layers.");
    //     }
    // };

    // const submitGenerate = () => {
    //     const base64Image = convertImageToBase64();
    //     if (base64Image) {
    //         setDrawImage(base64Image);
    //         handleWhiteBoardClose();
    //     }
    // };

    // const handleMouseDown = (e: any) => {
    //     if (isSelectMode) return;

    //     const pos = e.target.getStage().getPointerPosition();
    //     isDrawing.current = true;
    //     setStartPos(pos);

    //     if (penTool) {
    //         setLines((prevLines) => [
    //             ...prevLines,
    //             { tool, points: [pos.x, pos.y], color, strokeWidth: penWidth, id: generateId() },
    //         ]);
    //     } else if (textMode) {
    //         setTextPosition(pos);
    //         setTextInput("");
    //     } else {
    //         if (tool === "rect" || tool === "roundedRect" || tool === "circle" || tool === "triangle") {
    //             setShapes((prevShapes) => [
    //                 ...prevShapes,
    //                 { tool, x: pos.x, y: pos.y, color, fillColor: filled ? color : "transparent", strokeWidth: shapeStrokeWidth, id: generateId() },
    //             ]);
    //         }
    //     }
    // };

    // const handleMouseMove = (e: any) => {
    //     if (!isDrawing.current || isSelectMode) return;

    //     const stage = e.target.getStage();
    //     const pos = stage.getPointerPosition();

    //     if (penTool) {
    //         const lastLine = lines[lines.length - 1];
    //         lastLine.points = lastLine.points.concat([pos.x, pos.y]);
    //         const updatedLines = [...lines];
    //         updatedLines.splice(updatedLines.length - 1, 1, lastLine);
    //         setLines(updatedLines);
    //     } else if (tool === "rect" && startPos) {
    //         const lastShape = shapes[shapes.length - 1];
    //         lastShape.width = pos.x - startPos.x;
    //         lastShape.height = pos.y - startPos.y;
    //         const updatedShapes = [...shapes];
    //         updatedShapes.splice(updatedShapes.length - 1, 1, lastShape);
    //         setShapes(updatedShapes);
    //     }
    //     else if (tool === "roundedRect" && startPos) {
    //         const lastShape = shapes[shapes.length - 1];
    //         lastShape.width = pos.x - startPos.x;
    //         lastShape.height = pos.y - startPos.y;
    //         lastShape.radius = 10;
    //         const updatedShapes = [...shapes];
    //         updatedShapes.splice(updatedShapes.length - 1, 1, lastShape);
    //         setShapes(updatedShapes);
    //     }
    //     else if (tool === "circle" && startPos) {
    //         const lastShape = shapes[shapes.length - 1];
    //         const radius = Math.sqrt(
    //             Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
    //         );
    //         lastShape.radius = radius;
    //         const updatedShapes = [...shapes];
    //         updatedShapes.splice(updatedShapes.length - 1, 1, lastShape);
    //         setShapes(updatedShapes);
    //     } else if (tool === "triangle" && startPos) {
    //         const lastShape = shapes[shapes.length - 1];
    //         const x1 = startPos.x;
    //         const y1 = startPos.y;
    //         const x2 = pos.x;
    //         const y2 = pos.y;
    //         const x3 = (x1 + x2) / 2;
    //         const y3 = y1 - (y2 - y1);

    //         lastShape.points = [x1, y1, x2, y2, x3, y3];
    //         const updatedShapes = [...shapes];
    //         updatedShapes.splice(updatedShapes.length - 1, 1, lastShape);
    //         setShapes(updatedShapes);
    //     } else if (textMode && textPosition) {
    //         setTextPosition({ x: pos.x, y: pos.y });
    //         setTextBoxWidth(calculateTextWidth(textInput));
    //     }
    // };

    // const handleMouseUp = () => {
    //     isDrawing.current = false;
    //     setStartPos(null);
    // };

    // const handleDragStart = (e: any) => {
    //     setSelectedId(e.target.id());
    // };

    // const handleDragEnd = (e: any) => {
    //     const id = e.target.id();

    //     if (lines.find((line) => line.id === id)) {
    //         const lineIndex = lines.findIndex((line) => line.id === id);
    //         const line = lines[lineIndex];
    //         const updatedLine = { ...line, points: e.target.points() };
    //         const updatedLines = [...lines];
    //         updatedLines.splice(lineIndex, 1, updatedLine);
    //         setLines(updatedLines);
    //         setBoundingBox(null);
    //     } else {
    //         const shapeIndex = shapes.findIndex((shape) => shape.id === id);
    //         const shape = shapes[shapeIndex];
    //         const updatedShape = {
    //             ...shape,
    //             x: e.target.x(),
    //             y: e.target.y(),
    //         };
    //         const updatedShapes = [...shapes];
    //         updatedShapes.splice(shapeIndex, 1, updatedShape);
    //         setShapes(updatedShapes);
    //         setBoundingBox(null);
    //     }
    //     setSelectedId(null);
    // };

    // const handlePenTool = () => {
    //     setTool("select");
    //     setPenTool(!penTool);
    //     setIsSelectMode(false);
    //     setTextMode(false);
    //     setEraseMode(false);
    //     setTextPosition(null);
    //     setTextInput("");
    //     setTextBoxWidth(0);
    // };

    // const handleFill = () => {
    //     setFilled(!filled);
    //     setPenTool(false);
    //     setTextMode(false);
    //     setEraseMode(false);
    //     setTextPosition(null);
    //     setTextInput("");
    //     setTextBoxWidth(0);
    // }

    // const handleSelectMode = () => {
    //     setTool("select");
    //     setIsSelectMode(!isSelectMode);
    //     setPenTool(false);
    //     setTextMode(false);
    //     setEraseMode(false);
    //     setTextPosition(null);
    //     setTextInput("");
    //     setTextBoxWidth(0);
    // };

    // const handleTextMode = () => {
    //     setTool("select");
    //     setTextMode(!textMode);
    //     setPenTool(false);
    //     setIsSelectMode(false);
    //     setEraseMode(false);

    // };
    // const handleEraseMode = () => {
    //     setTool("select");
    //     setEraseMode(!eraseMode);
    //     setPenTool(false);
    //     setIsSelectMode(false);
    //     setTextMode(false);
    //     setTextPosition(null);
    //     setTextInput("");
    //     setTextBoxWidth(0);
    // };

    // const handleSelectShapeOrLine = (item: any) => {
    //     setSelectedId(item.id);
    //     if (item.points) {
    //         const points = item.points;
    //         const xs = points.filter((_: any, i: number) => i % 2 === 0);
    //         const ys = points.filter((_: any, i: number) => i % 2 === 1);
    //         const minX = Math.min(...xs);
    //         const minY = Math.min(...ys);
    //         const maxX = Math.max(...xs);
    //         const maxY = Math.max(...ys);
    //         setBoundingBox({
    //             x: minX,
    //             y: minY,
    //             width: maxX - minX,
    //             height: maxY - minY,
    //             fillColor: item.color,
    //         });
    //     } else if (item.width && item.height) {
    //         setBoundingBox({
    //             x: item.x,
    //             y: item.y,
    //             width: item.width,
    //             height: item.height,
    //             fillColor: item.color,
    //         });
    //     } else if (item.radius) {
    //         setBoundingBox({
    //             x: item.x - item.radius,
    //             y: item.y - item.radius,
    //             width: item.radius * 2,
    //             height: item.radius * 2,
    //             fillColor: item.color,
    //         });
    //     }
    // };
    // const handleShapeClick = (e: any, item: any) => {
    //     if (eraseMode) {
    //         if (item.points) {
    //             setLines((prevLines) => prevLines.filter((line) => line.id !== item.id));
    //         } else {
    //             setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== item.id));
    //         }
    //     } else {
    //         handleSelectShapeOrLine(item);
    //     }
    // };
    // const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const inputText = e.target.value;
    //     setTextInput(inputText);
    //     setTextBoxWidth(calculateTextWidth(inputText));
    // };

    // const handleTextClick = (e: any, textItem: TextType) => {
    //     if (eraseMode) {
    //         setTexts((prevTexts) => prevTexts.filter((text) => text.id !== textItem.id));
    //     } else {
    //         handleSelectShapeOrLine(textItem);
    //     }
    // };

    // const handleTextEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter' && textInput && textPosition) {
    //         setTexts((prevTexts) => [
    //             ...prevTexts,
    //             { text: textInput, x: textPosition.x, y: textPosition.y, fontSize: 20, color, id: generateId() },
    //         ]);
    //         setTextPosition(null);
    //         setTextInput("");
    //         setTextBoxWidth(0);
    //     }
    // };
    // const calculateTextWidth = (text: string) => {
    //     const canvas = document.createElement('canvas');
    //     const context = canvas.getContext('2d');
    //     if (context) {
    //         context.font = '20px Arial';
    //         return context.measureText(text).width + 10;
    //     }
    //     return 0;
    // };

    // return (
    //     <div className="h-screen flex justify-center items-center bg-black relative">
    //         <div 
    //             onClick={handleWhiteBoardClose}
    //             className="absolute top-5 right-5 cursor-pointer"
    //         >
    //             <Icon path={mdiSwordCross} size={1} className="text-white" />
    //         </div>

    //         <div className="relative w-[90vw] h-[85vh]">
    //             <Stage
    //                 ref={stageRef}
    //                 width={window.innerWidth * 0.9}
    //                 height={window.innerHeight * 0.85}
    //                 onMouseDown={handleMouseDown}
    //                 onMouseMove={handleMouseMove}
    //                 onMouseUp={handleMouseUp}
    //                 style={{
    //                     border: '1px solid',
    //                     borderRadius: 25,
    //                     background: '#FFF',
    //                     cursor: penTool
    //                         ? `default`
    //                         : isSelectMode
    //                             ? "move"
    //                             : textMode
    //                                 ? "text"
    //                                 : eraseMode
    //                                     ? `url('${Erase}'), auto`
    //                                     : "default",
    //                 }}
    //             >
    //                 <Layer>
    //                     {lines.map((line) => (
    //                         <Line
    //                             key={line.id}
    //                             id={line.id}
    //                             points={line.points}
    //                             stroke={line.color}
    //                             strokeWidth={line.strokeWidth}
    //                             tension={0.5}
    //                             lineCap="round"
    //                             draggable={isSelectMode}
    //                             onDragStart={handleDragStart}
    //                             onDragEnd={handleDragEnd}
    //                             onClick={(e) => handleShapeClick(e, line)}
    //                         />
    //                     ))}
    //                     {shapes.map((shape, i) => {
    //                         if (shape.tool === "rect") {
    //                             return (
    //                                 <Rect
    //                                     key={shape.id}
    //                                     id={shape.id}
    //                                     x={shape.x}
    //                                     y={shape.y}
    //                                     width={shape.width}
    //                                     height={shape.height}
    //                                     fill={shape.fillColor}
    //                                     stroke={shape.color}
    //                                     strokeWidth={shape.strokeWidth}
    //                                     draggable={isSelectMode}
    //                                     onDragStart={handleDragStart}
    //                                     onDragEnd={handleDragEnd}
    //                                     onClick={(e) => handleShapeClick(e, shape)}
    //                                 />
    //                             );
    //                         }
    //                         else if (shape.tool === "roundedRect") {
    //                             return (
    //                                 <Rect
    //                                     key={shape.id}
    //                                     id={shape.id}
    //                                     x={shape.x}
    //                                     y={shape.y}
    //                                     width={shape.width}
    //                                     height={shape.height}
    //                                     fill={shape.fillColor}
    //                                     stroke={shape.color}
    //                                     strokeWidth={shape.strokeWidth}
    //                                     cornerRadius={shape.cornerRadius || 10}
    //                                     draggable={isSelectMode}
    //                                     onDragStart={handleDragStart}
    //                                     onDragEnd={handleDragEnd}
    //                                     onClick={(e) => handleShapeClick(e, shape)}
    //                                 />
    //                             );
    //                         }
    //                         else if (shape.tool === "circle") {
    //                             return (
    //                                 <Circle
    //                                     key={shape.id}
    //                                     id={shape.id}
    //                                     x={shape.x}
    //                                     y={shape.y}
    //                                     radius={shape.radius}
    //                                     fill={shape.fillColor}
    //                                     stroke={shape.color}
    //                                     strokeWidth={shape.strokeWidth}
    //                                     draggable={isSelectMode}
    //                                     onDragStart={handleDragStart}
    //                                     onDragEnd={handleDragEnd}
    //                                     onClick={(e) => handleShapeClick(e, shape)}
    //                                 />
    //                             );
    //                         } else if (shape.tool === "triangle") {
    //                             return (
    //                                 <Line
    //                                     key={shape.id}
    //                                     id={shape.id}
    //                                     points={shape.points!}
    //                                     fill={shape.fillColor}
    //                                     stroke={shape.color}
    //                                     strokeWidth={shape.strokeWidth}
    //                                     closed
    //                                     draggable={isSelectMode}
    //                                     onDragStart={handleDragStart}
    //                                     onDragEnd={handleDragEnd}
    //                                     onClick={(e) => handleShapeClick(e, shape)}
    //                                 />
    //                             );
    //                         }
    //                         return null;
    //                     })}

    //                     {texts.map((text, index) => (
    //                         <Text
    //                             key={index}
    //                             text={text.text}
    //                             x={text.x}
    //                             y={text.y}
    //                             fontSize={text.fontSize}
    //                             fill={text.color}
    //                             draggable
    //                             id={text.id}
    //                             onClick={(e) => handleTextClick(e, text)}
    //                             onDragStart={handleDragStart}
    //                             onDragEnd={handleDragEnd}
    //                         />
    //                     ))}
    //                 </Layer>

    //             </Stage>

    //         <div className="absolute bottom-2.5 left-[40%] bg-white py-1 px-1 rounded shadow-lg flex">
    //                 <button 
    //                     onClick={handleSelectMode}
    //                     className={`w-8 h-8 rounded mx-1 flex justify-center items-center ${isSelectMode ? 'bg-black' : 'bg-transparent'}`}
    //                 >
    //                     <i className={`bi bi-cursor ${isSelectMode ? 'text-white' : 'text-black'}`}></i>
    //                 </button>

    //                 <button 
    //                     onClick={handlePenTool}
    //                     className={`w-8 h-8 rounded mr-1 flex justify-center items-center ${penTool ? 'bg-black' : 'bg-transparent'}`}
    //                 >
    //                     <i className={`bi bi-pen ${penTool ? 'text-white' : 'text-black'}`}></i>
    //                 </button>

    //                 <button 
    //                     onClick={handleFill}
    //                     className={`w-8 h-8 rounded mr-1 flex justify-center items-center ${filled ? 'bg-black' : 'bg-transparent'}`}
    //                 >
    //                     <i className={`bi bi-paint-bucket ${filled ? 'text-white' : 'text-black'}`}></i>
    //                 </button>

    //                 <select
    //                     value={tool}
    //                     onChange={(e) => setTool(e.target.value)}
    //                     disabled={isSelectMode || penTool || textMode || eraseMode}
    //                     className="mr-1 rounded px-2"
    //                 >
    //                     <option value="select" disabled>Select Shape</option>
    //                     <option value="rect">Rectangle</option>
    //                     <option value="roundedRect">Rounded Rectangle</option>
    //                     <option value="circle">Circle</option>
    //                     <option value="triangle">Triangle</option>
    //                 </select>

    //                 <button 
    //                     onClick={handleTextMode}
    //                     className={`w-8 h-8 rounded mx-1 flex justify-center items-center ${textMode ? 'bg-black' : 'bg-transparent'}`}
    //                 >
    //                     <i className={`bi bi-fonts ${textMode ? 'text-white' : 'text-black'}`}></i>
    //                 </button>

    //                 <button 
    //                     onClick={handleEraseMode}
    //                     className={`w-8 h-8 rounded mr-1 flex justify-center items-center ${eraseMode ? 'bg-black' : 'bg-transparent'}`}
    //                 >
    //                     <i className={`bi bi-eraser ${eraseMode ? 'text-white' : 'text-black'}`}></i>
    //                 </button>

    //                 <div className="h-8 rounded mr-1 flex justify-center items-center">
    //                     <input
    //                         type="color"
    //                         value={color}
    //                         onChange={(e) => setColor(e.target.value)}
    //                         disabled={isSelectMode}
    //                         className="h-full border-none outline-none p-0 bg-transparent cursor-pointer"
    //                     />
    //                 </div>

    //                 <div className="relative">
    //                     <button 
    //                         onClick={() => setShowMenu(!showMenu)}
    //                         className="w-8 h-8 rounded mr-1 flex justify-center items-center bg-transparent"
    //                     >
    //                         <i className="bi bi-chevron-up text-black"></i>
    //                     </button>

    //                     {showMenu && (
    //                         <div className="absolute bottom-full mb-2 bg-white rounded shadow-lg min-w-[150px]">
    //                             <button 
    //                                 onClick={saveImage}
    //                                 className="w-full flex items-center p-2 hover:bg-gray-100"
    //                             >
    //                                 <img src={Download} className="w-5 h-5" alt="download" />
    //                                 <span className="ml-2 text-sm">Save</span>
    //                             </button>
    //                             <button 
    //                                 onClick={submitGenerate}
    //                                 className="w-full flex items-center p-2 hover:bg-gray-100"
    //                             >
    //                                 <img src={Star} className="w-5 h-5" alt="generate" />
    //                                 <span className="ml-2 text-sm">Generate</span>
    //                             </button>
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>

    //             {/* Width Controls */}
    //             <div className="absolute top-2.5 left-5">
    //                 <div className="mb-2">
    //                     <label className="text-black mr-2.5">Pen Width: {penWidth}</label>
    //                     <input
    //                         type="range"
    //                         min="1"
    //                         max="10"
    //                         value={penWidth}
    //                         onChange={(e) => setPenWidth(parseInt(e.target.value))}
    //                         className="w-32"
    //                     />
    //                 </div>
    //                 <div>
    //                     <label className="text-black mr-2.5">Shape Border Width: {shapeStrokeWidth}</label>
    //                     <input
    //                         type="range"
    //                         min="1"
    //                         max="10"
    //                         value={shapeStrokeWidth}
    //                         onChange={(e) => setShapeStrokeWidth(parseInt(e.target.value))}
    //                         className="w-32"
    //                     />
    //                 </div>
    //             </div>
    //         </div>

    //         {textPosition && (
    //             <input
    //                 type="text"
    //                 value={textInput}
    //                 onChange={handleTextInputChange}
    //                 onKeyDown={handleTextEnter}
    //                 className="absolute p-1.5 text-xl"
    //                 style={{ 
    //                     left: textPosition.x, 
    //                     top: textPosition.y, 
    //                     width: textBoxWidth 
    //                 }}
    //                 autoFocus
    //             />
    //         )}
    //     </div>
    // );
};

export default WhiteBoard;