import { useState, useEffect } from "react"
import "./admin.css"
import { auth, db } from "../../firebaseConnection"
import { signOut } from "firebase/auth"
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore"

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState("")
    const [user, setUser] = useState({})
    const [edit, setEdit] = useState({})

    const [tarefas, setTarefas] = useState([])

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail)

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {

                    let lista = []
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid

                        })
                    })
                    setTarefas(lista)
                })
            }
        }

        loadTarefas()
    }, [])

    async function handleRegister(e) {
        e.preventDefault()

        if (tarefaInput === "") {
            alert("Entre com uma tarefa!")
            return
        }

        if(edit?.id){
            handleUpdateTarefa()
            return
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                console.log("TAREFA ADICIONADA COM SUCESSO!")
                setTarefaInput("")
            })
            .catch((error) => {
                console.log("ERRO AO ADICIONAR TAREFA!" + error)
            })
    }

    async function handleLogout() {
        await signOut(auth)
    }

    async function deletarTarefa(id){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }

    function editarTarefa(item){
       setTarefaInput(item.tarefa)
       setEdit(item)
    }

    async function handleUpdateTarefa() {
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
        .then(() => {
            console.log("TAREFA ATUALIZADA!")
            setTarefaInput("")
            setEdit({})
        })
        .catch(() => {
            console.log("ERRO AO ATUALIZAR!")
            setTarefaInput("")
            setEdit({})
        })
    }

    return (
        <div className="admin-container">
            <h1>Minhas Tarefas</h1>

            <form className="form" onSubmit={handleRegister}>
                <textarea
                    placeholder="Adicione uma tarefa..."
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <button className="btn-register" type="submit"  style={{backgroundColor: "#6add39"}} >Atualizar Tarefa</button>
                ): (<button className="btn-register" type="submit" >Adicionar Tarefa</button>
                )}
            </form>

            {tarefas.map((item) =>(
                <article key={item.id} className="list">
                <p> {item.tarefa} </p>
                <div>
                    <button onClick={() => editarTarefa(item)}>Editar</button>
                    <button onClick={() => deletarTarefa(item.id)} className="btn-delete">Concluir</button>
                </div>
            </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
    )
}