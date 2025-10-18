import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SwitchTheme } from "../../components/switch-theme/switch-theme";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TaskInterface } from '../../interfaces/taskInterface';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { StatsInterface } from '../../interfaces/statsInterface';

@Component({
  selector: 'app-main',
  imports: [SwitchTheme, ButtonModule, CardModule, InputTextModule, ToggleButtonModule, FormsModule, ToastModule, CheckboxModule, CommonModule, PaginatorModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {

  task = {
    title: ''
  }

  stats: StatsInterface = {
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0
  }

  taskList: TaskInterface[] = [];
  first: number = 0;
  rows: number = 5;
  totalPage: number = 0;

  constructor(
    private router: Router,
    private service: Task,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  totalTasks: number = 0;

  loadTasks(page: number = 0, size: number = 5) {
    const completed = this.getCompletedForFilter();

    this.service.listTask(page, size, completed).subscribe({
      next: data => {
        this.taskList = data.content;
        this.totalTasks = data.totalElements;
        this.totalPage = data.totalPages;
        this.cdr.detectChanges();
        console.log(this.totalTasks, this.totalPage)
      },
      error: err => console.log(err)
    });
  }

  private getCompletedForFilter(): boolean | undefined {
    if (this.activeFilter === 'ativas') return false;
    if (this.activeFilter === 'concluidas') return true;
    return undefined;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;

    const page = Math.floor(this.first / this.rows);
    this.loadTasks(page, this.rows);
  }

  activeFilter: string = 'todas';

  setFilter(filter: string) {
    this.activeFilter = filter;
    console.log('Filtro selecionado:', filter);
    this.loadTasks(0, this.rows)
  }

  ngOnInit() {
    this.setFilter(this.activeFilter)
    this.updateStats();
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
    this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Usuário deslogado!', life: 3000 });
  }


  addTask() {
    this.service.createTask(this.task).subscribe({
      next: (newTask: TaskInterface) => {
        console.log('Task registrada com sucesso', newTask);
        this.task.title = '';
        const currentPage = Math.floor(this.first / this.rows);
        this.loadTasks(currentPage, this.rows)
        this.updateStats();
        this.messageService.add({ severity: 'success', summary: 'Adicionado', detail: 'Tarefa adicionado com sucesso!', life: 3000 });
      },
      error: (err) => {
        console.error('Erro ao registrar a task', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar tarefa!', life: 3000 });
      }
    })
  }

  deleteTask(id: number) {
    this.service.deleteTask(id).subscribe({
      next: () => {
        console.log("Item deletado com sucesso");
        const currentPage = Math.floor(this.first / this.rows);
        this.loadTasks(currentPage, this.rows);
        this.taskList = this.taskList.filter(task => task.id !== id);
        this.cdr.detectChanges();
        this.updateStats();
        this.messageService.add({ severity: 'info', summary: 'Deletado', detail: `Tarefa deletada com sucesso`, life: 3000 });
      },
      error: (err) => {
        console.error('Erro ao deletar a tarefa', err);
      }
    })
  }


  checkedTask(task: TaskInterface) {
    this.service.updateTask({ id: task.id, completed: task.completed }).subscribe({
      next: () => {
        console.log(`Status da tarefa ${task.id} atualizado para ${task.completed}`);
        if (this.activeFilter === 'ativas' && task.completed) {
          this.taskList = this.taskList.filter(t => t.id !== task.id);
        } else if (this.activeFilter === 'concluidas' && !task.completed) {
          this.taskList = this.taskList.filter(t => t.id !== task.id);
        }

        this.cdr.detectChanges();
        this.updateStats();
        if (task.completed) {
          this.messageService.add({ severity: 'success', summary: 'Atualizado', detail: 'Status da tarefa foi alterado.', life: 2000 });
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar a tarefa', err);
        task.completed = !task.completed;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível alterar o status.', life: 3000 });
      }
    })
  }

  editingTaskId: number | null = null;
  editedTitle: string = '';
  editTask(task: TaskInterface): void {
    this.editingTaskId = task.id;
    this.editedTitle = task.title;
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editedTitle = '';
  }

  updateTask(task: TaskInterface) {
    this.service.updateTask({ id: task.id, title: this.editedTitle }).subscribe({
      next: () => {
        task.title = this.editedTitle;
        this.cancelEdit();
        this.messageService.add({ severity: 'success', summary: 'Atualizado', detail: 'Tarefa editada!', life: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível editar a tarefa.', life: 3000 });
      }
    });
  }

  updateStats() {
    this.service.getStatsTask().subscribe({
      next: (data) => {
        this.stats = {
          totalTasks: data.totalTasks,
          completedTasks: data.completedTasks,
          activeTasks: data.activeTasks
        }
        this.cdr.detectChanges();
        console.log(this.stats)
      }
    })
  }
}
