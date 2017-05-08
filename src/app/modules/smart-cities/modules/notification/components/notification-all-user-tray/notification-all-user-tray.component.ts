import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Alert } from '../../../../../../core/models/alert';
import { NotificationType } from '../../../../../../core/models/notification-type';
import { AlertService } from '../../../../../../core/services/alert/alert.service';
import { LoginService } from '../../../../../../core/services/login/login.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { EnumEx } from '../../../../../../core/models/EnumEx';
import { NotificationTypeService } from '../../../../../../core/services/notification-type/notification-type.service';
import { Paginable } from '../../../../../../core/common/paginable';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'notification-all-user-tray',
    templateUrl: './notification-all-user-tray.component.html',
    styleUrls: ['./notification-all-user-tray.component.sass'],

})
export class NotificationAllUserTrayComponent implements OnInit {

    // Variables utilizadas para mostrar la ventana modal, isConfirm=true (Muestra 2 botones Aceptar, Cancelar),
    // isConfirm=false (Muestra solo un botón Aceptar), messageModal (Mensaje que muestra la ventana Modal),
    // includeText (Se utiliza para mostrar un textArea o no)
    private showDialog: boolean;
    private isConfirm: boolean;
    private messageModal: string;
    private includeText: boolean;
    private alerts: Alert[] = [];
    private objNotification: NotificationType;
    private notifications: NotificationType[] = [];
    private subNotifications: any[] = [];
    private page: number;
    private total: number;
    private element: any;
    private isAll: boolean;
    private isSearch: boolean;
    private param: string;
    private instance: Paginable;

    notificationId: string;
    subNotificationId: string;
    Form: FormGroup;

    initPage: string;
    initSize: string;
    initValue: string;

    constructor(private _service: AlertService, private _loginService: LoginService,
        private _router: Router, private _notificationService: NotificationTypeService,
        private fb: FormBuilder, private route: ActivatedRoute) {
        this.initPage = '0';
        this.initSize = '10';
        this.initValue = '-1';
    }

    private prepareForm() {
        this.Form = this.fb.group({
            'notificationType': this.buildFormControl(this.notificationId),
            'subNotification': this.buildFormControl(this.subNotificationId),
        });
    }

    private buildFormControl(value?: any): FormControl {
        return new FormControl(value);
    }

    ngOnInit() {
        try {
            this.route.params.subscribe(params => { this.param = params['id']; });
            this.element = document.getElementById('subNotification');
            this.element = (<HTMLSelectElement>this.element);
            this.setPage(this.param);
            this.getNotification();
            this.isConfirm = true;
            this.messageModal = '';
            this.includeText = false;
        } catch (e) {
            this.setValuesModal(this.messageModal, true, false);
        }
    }

    setPage(id: string) {
        if (id !== '0') {
            // this.bindTable(this.initPage, this.initSize);
            this.getAlertsByAlertType(id, this.initPage, this.initSize);
            this.notificationId = id;
            // this.objNotification = new NotificationType();
            // for (let i = 0; i < this.notifications.length; i++) {
            //   if (this.notifications[i].id === id) {
            //     this.objNotification = this.notifications[i];
            //     break;
            //   }
            // }
            // this.subNotifications = this.objNotification.subnotifications;
            this.isAll = false;
            this.isSearch = true;
        } else {
            this.bindTable(this.initPage, this.initSize);
            this.notificationId = this.initValue;
            this.isAll = true;
            this.isSearch = false;
        }
        this.subNotificationId = this.initValue;
        if (this.element != null) {
            this.element.disabled = true;
        }
        this.prepareForm();
    }

    // Metodo que se utiliza para el llenado de la tabla con los datos de todas las alertas
    // registradas.
    bindTable(page: string, size: string) {
        try {
            this._service.getAllByUser(page, size).subscribe(
                (res) => {
                    this.instance = new Paginable().deserialize(res);
                    this.alerts = this.instance.content;
                    this.total = this.instance.totalElements;
                },
                (error) => {
                    this.messageModal = error;
                });
        } catch (e) {
            throw e;
        }
    }

    // Metodo que se utiliza para el llenado de la tabla con los datos de todas las alertas
    // registradas por tipo de alerta
    getAlertsByAlertType(type: string, page: string, size: string) {
        try {
            this._service.getAllByTypeAlert(type, page, size).subscribe(
                (res) => {
                    this.instance = new Paginable().deserialize(res);
                    this.alerts = this.instance.content;
                    this.total = this.instance.totalElements;
                },
                (error) => {
                    this.messageModal = error;
                });
        } catch (e) {
            throw e;
        }
    }

    // Metodo que se utiliza para el llenado de la tabla con los datos de todas las alertas
    // registradas por tipo de alerta y sub-tipo de alerta
    getAlertsByAlertAndEvent(type: string, subType: string, page: string, size: string) {
        try {
            this._service.getAllByTypeSubTypeAlert(type, subType, page, size).subscribe(
                (res) => {
                    this.instance = new Paginable().deserialize(res);
                    this.alerts = this.instance.content;
                    this.total = this.instance.totalElements;
                },
                (error) => {
                    this.messageModal = error;
                });
        } catch (e) {
            throw e;
        }
    }

    // Metodo que se utiliza para llenar el combo de Tipos de Alerta
    getNotification() {
        try {
            let intervalo;
            this._notificationService.getAll().subscribe(
                (res) => {
                    intervalo = setInterval(() => {
                        if (this.alerts.length > 0) {
                            clearInterval(intervalo);
                            for (let i = 0; i < res.length; i++) {
                                for (let j = 0; j < this.alerts.length; j++) {
                                    if (res[i].id === this.alerts[j].alertType) {
                                        this.notifications.push(res[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }, 1000);
                },
                (error) => {
                    this.messageModal = error;
                });
        } catch (e) { throw e; }
    }

    // Evento que se lanza cuando se cambia de pagina en el paginador
    pageChanged(page: number) {
        let pagina: string;

        pagina = (page - 1).toString();
        this.page = page;
        if (this.isAll) {
            this.bindTable(pagina, this.initSize);
        } else if (this.isSearch && this.notificationId !== this.initValue
            && this.subNotificationId === this.initValue) {
            this.getAlertsByAlertType(this.notificationId, pagina, this.initSize);
        } else if (this.isSearch && this.notificationId !== this.initValue
            && this.subNotificationId !== this.initValue) {
            this.getAlertsByAlertAndEvent(this.notificationId, this.subNotificationId, pagina, this.initSize);
        }
    }

    // Evento que se lanza cuando se cambia de elemento en el combo de Tipo de Alerta
    onNotificationTypeChange(val) {
        try {
            this.objNotification = new NotificationType();
            for (let i = 0; i < this.notifications.length; i++) {
                if (this.notifications[i].id === val) {
                    this.objNotification = this.notifications[i];
                    break;
                }
            }
            this.subNotifications = this.objNotification.subnotifications;
            this.notificationId = val;
            this.subNotificationId = this.initValue;
            if (this.element != null) {
                if (val !== this.initValue) {
                    this.element.disabled = false;
                } else {
                    this.element.disabled = true;
                    this.isAll = true;
                    this.isSearch = false;
                }
            }
            this.prepareForm();
        } catch (e) {
            this.setValuesModal('An error occurred while search Subtype alert', true, false);
        }
    }

    // Evento que se lanza cuando se cambia de elemento en el combo de Sub-Tipo de Alerta
    onSubNotificationChange(val) {
        try {
            this.subNotificationId = val;
        } catch (e) {
            this.setValuesModal('An error occurred while search Subtype alert', true, false);
        }
    }

    // Metodo que se llama cuando se confirma la eliminación del registro
    confirmDelete() {
        try {
            if (this.isConfirm) {
            } else {
                this.showDialog = false;
            }
        } catch (e) { throw e; }
    }

    // Evento que se lanza cuando se reestablecen los criterios de busqueda con el botón clear
    OnClear() {
        try {
            this.notificationId = this.initValue;
            this.subNotificationId = this.initValue;
            this.prepareForm();
            this.element.disabled = true;
            this.isAll = true;
            this.isSearch = false;
            this.bindTable(this.initPage, this.initSize);
        } catch (e) {
            this.setValuesModal('An error occurred while clearing the search controls', true, false);
        }
    }
    // Evento que se lanza cuando se realiza una busqueda con el botón search
    onSearch() {
        try {
            if (this.notificationId !== this.initValue) {
                this.isAll = false;
                this.isSearch = true;
            } else {
                this.isAll = true;
                this.isSearch = false;
            }

            if (this.notificationId !== this.initValue && this.subNotificationId === this.initValue) {
                this.getAlertsByAlertType(this.notificationId, this.initPage, this.initSize);
            } else if (this.notificationId !== this.initValue && this.subNotificationId !== this.initValue) {
                this.getAlertsByAlertAndEvent(this.notificationId, this.subNotificationId, this.initPage, this.initSize);
            } else if (this.isAll) {
                this.bindTable(this.initPage, this.initSize);
            }

        } catch (e) {
            this.setValuesModal('An error occurred while searching data', true, false);
        }
    }

    setValuesModal(message: string, show: boolean, confirm: boolean) {
        this.isConfirm = confirm;
        this.messageModal = message;
        this.showDialog = show;
    }

}