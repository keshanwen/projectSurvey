/* @refresh reload */
import { render } from "solid-js/web";
import Task from './task'

const root = document.getElementById("root");

render(() => <Task />, root!);
