import Note from "./components/Note";
import { useState, useEffect } from "react";
import axios from "axios";
import noteService from "./services/notes.js";

const App = () => {
  //声明状态
  const [notes, setNotes] = useState([]); //保存笔记列表
  const [newNote, setNewNote] = useState(""); //新笔记内容
  const [showAll, setShowAll] = useState(true); //是否显示所有笔记
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  //向服务器请求所有笔记
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  //向服务器添加笔记
  const addNote = (event) => {
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value); //将输入框的内容保存到新笔记中
  };

  //过滤笔记
  const noteToShow = showAll ? notes : notes.filter((note) => note.important);

  //更新笔记，切换笔记的重要性
  const toggleImportanceOf = (id) => {
    console.log("toggleImportanceOf");

    const note = notes.find((n) => n.id === id);
    const changeNote = {
      ...note,
      important: !note.important,
    };
    noteService
      .update(id, changeNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `the notes ${note.content} was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  //错误消息组件
  const Notifiication = ({ message }) => {
    if (message === null) {
      return null;
    }
    return <div className="error">{message}</div>;
  };

  const Footer = () => {
    const footerStyle = {
      color: "green",
      fontStyle: "italic",
      fontSize: 16,
    };
    return (
      <div style={footerStyle}>
        <br />
        <em>
          Note app, Department of Computer Science, University of Helsinki 2023
        </em>
      </div>
    );
  };
  return (
    <div>
      <h1>Notes</h1>
      <Notifiication message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "importent" : "all"}
        </button>
      </div>
      <ul>
        {noteToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
