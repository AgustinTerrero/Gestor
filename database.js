import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const guardarProducto = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, "inventario"), producto);
    console.log("Producto guardado con ID:", docRef.id);
  } catch (error) {
    console.error("Error al guardar el producto:", error);
  }
};

export { guardarProducto };

guardarProducto({
    nombre: "Impresora HP",
    cantidad: 10,
    precio: 50000
  });

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const obtenerInventario = async () => {
  const querySnapshot = await getDocs(collection(db, "inventario"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
};

export { obtenerInventario };

import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const actualizarProducto = async (id, nuevosDatos) => {
  const productoRef = doc(db, "inventario", id);
  await updateDoc(productoRef, nuevosDatos);
};

import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";

const eliminarProducto = async (id) => {
  const productoRef = doc(db, "inventario", id);
  await deleteDoc(productoRef);
};

