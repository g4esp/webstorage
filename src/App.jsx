import { useState, useEffect, useRef } from "react"

function App() {

  const [tasks, setTasks] = useState(JSON.parse(window.localStorage.getItem("tasks")) || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editTaskNumb, setIsEditTaskNumb] = useState(0)
  const [task, setTask] = useState({ title: "", content: "", tags: [], priority: "Low", done: false })
  const [tagsInput, setTagsInput] = useState('')
  const [filter, setFilter] = useState('All')
  
  const initialRender = useRef(true)

  useEffect(() => {
    if (!initialRender.current) {
      window.localStorage.setItem("tasks", JSON.stringify(tasks))
    } else {
      initialRender.current = false
    }
  }, [tasks])

  const emptyList = () => {
    setTasks([])
    window.localStorage.clear()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      setTasks(tasks.map(item => item.id === task.id ? task : item))
      setIsEditing(false)
    } else {
      task.id = Date.now().toString()
      setTasks((list) => {
        return list.concat(task)
      })
    }
    setTask({ title: "", content: "", tags: [], priority: "Low", done: false })
  }
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }
  const handleDone = (item) => {
    setTasks(tasks.map(task => {
      if (task.id === item.id) {
        task.done = !item.done
      }
      return task 
    }))
  }
  const handleTagChange = (e) => {
    setTagsInput(e.target.value)
  }
  const handleTagsArr = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      task.tags.push(tagsInput.trim())
      setTagsInput('')
      return
    }
    if(e.target.value.indexOf(",") !== -1) {
      task.tags.push(e.target.value.replace(",", ""))
      setTagsInput('')
      return
    }
  }
  const removeTags = (tag) => {
    setTask({ ...task, tags: task.tags.filter(item => item !== tag) })
  }
  const removeTask = (id) => {
    setTasks(tasks.filter(item => item.id !== id))
  }
  const handleFilter = e => {
    setFilter(e.target.value)
  }
  const filtxprior = (item) => {
    if (filter === 'All') return item
    return item.priority === filter
  }
  const performEditTask = (item) => {
    setIsEditTaskNumb(tasks.indexOf(item))
    setIsEditing(true)
    setTask(item)
  }

  return (
    <>
      <div className="w-full md:w-2/6 mx-auto p-4 text-center">
        <div className="text-center mt-6 mb-8 mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 font-mono">DailyTASKS</h1>
        </div>
        <form onSubmit={handleSubmit} className="text-left shadow-md rounded-xl block">
          <div className="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <div className="text-sm font-medium text-gray-700 flex">
                <label htmlFor="priority" className="w-1/5">
                  Priority
                </label>
                <label htmlFor="title" className="w-4/5">
                  Title
                </label>
              </div>
              <div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-1/5 px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs focus:ring focus:ring-inset focus:outline-none focus:ring-indigo-500 ">
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    type="text"
                    name="title"
                    className="w-4/5 focus:ring focus:ring-inset focus:outline-none focus:ring-indigo-500  flex-1 block rounded-none rounded-r-md sm:text-sm border border-gray-300 p-2"
                    placeholder="Task title..."
                    value={task.title}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tags"
                  className="focus:ring focus:ring-inset focus:outline-none focus:ring-indigo-500 flex-1 block w-full rounded-md sm:text-sm border border-gray-300 p-2"
                  placeholder="tag1,tag2,tag3..."
                  value={tagsInput}
                  onChange={(e)=>{handleTagChange(e)}}
                  onKeyDown={(e)=>{handleTagsArr(e)}}
                />
                <ul className="mt-1 ">
                  {task?.tags?.map((tag, i) => <li key={i} className="text-xs px-2 py-1 text-indigo-400 bg-indigo-100 rounded-2xl inline mr-2 cursor-pointer" onClick={() => { removeTags(tag) }}>{`x ${tag}`}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Details
              </label>
              <div className="mt-1">
                <textarea
                  name="content"
                  rows="3"
                  className="shadow-sm focus:ring focus:ring-inset focus:outline-none focus:ring-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Task details..."
                  onChange={handleChange}
                  value={task.content}>
                </textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description for the Task
              </p>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-center sm:px-6 rounded-b-xl">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isEditing ? `Save TASK #${(1 + editTaskNumb)}` : `Add TASK #${(tasks.length + 1)}`}
            </button>
          </div>
        </form>
        {(tasks.length > 0) &&
          <>
            <div className="text-center mt-9 mb-3">
              <h2 className="text-3xl font-bold text-gray-800 font-mono">Tasks</h2>
            </div>
            <select 
            name="priorFilter" 
            className="mt-6 block mx-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm" 
            onChange={handleFilter}
            >
              <option value="All">All </option>
              <option value="High">High priority</option>
              <option value="Low">Low priority</option>
            </select>
            <div className="my-6 space-y-6">
              {tasks
                .filter(filtxprior)
                .map((task) => {
                  return (
                    <article className={`bg-gray-100 border-md p-6 font-mono text-left rounded-md relative ${task.done === true ? "text-slate-300" : ""}`} key={task.id}>
                      <div className="flex justify-between items-center">
                        <h3 
                          className={`uppercase text-2xl mb-2 ${task.done === true ? "" : task.priority === "High" ? "before:content-['•'] before:text-red-600 before:animate-ping": "before:content-['•'] before:text-green-400"}`}>
                            {task.title}
                        </h3>
                        <div className="w-16 flex justify-around">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} onClick={() => {handleDone(task)}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {!task.done && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} onClick={() => { performEditTask(task) }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => { removeTask(task.id) }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                      </div>
                      {task.tags &&
                        <ul className="text-xs mb-3">
                          {task.tags.map((tag, i) => {
                            return (
                              <li key={i} className={`inline-block uppercase ${task.done === true ? "" : "text-gray-500"}`}>
                                <span className="mr-3">#{tag}</span>
                              </li>
                            )
                          })}
                        </ul>
                      }
                      <p className="text-sm">
                        {task.content}
                      </p>
                    </article>
                  )
                })}
            </div>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mx-auto flex justify-center items-center" onClick={emptyList}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {"Clear Tasks"}
            </button>
          </>
        }
      </div>

    </>
  )
}

export default App