import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { Laboratorios } from './laboratorios';
import { LaboratorioService } from '../../services/laboratorio';
import { By } from '@angular/platform-browser';

describe('Laboratorios', () => {
    let fixture: ComponentFixture<Laboratorios>;
    let component: Laboratorios;

    let labServiceSpy: jasmine.SpyObj<LaboratorioService>;

    beforeEach(async () => {
        labServiceSpy = jasmine.createSpyObj<LaboratorioService>('LaboratorioService', [
            'listar',
            'listarActivos',
            'crear',
            'actualizar',
            'eliminar',
        ]);

        labServiceSpy.listar.and.returnValue(of([]));
        labServiceSpy.listarActivos.and.returnValue(of([]));
        labServiceSpy.crear.and.returnValue(of({} as any));
        labServiceSpy.actualizar.and.returnValue(of({} as any));
        labServiceSpy.eliminar.and.returnValue(of({} as any));

        await TestBed.configureTestingModule({
            imports: [Laboratorios],
            providers: [
                FormBuilder,
                { provide: LaboratorioService, useValue: labServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Laboratorios);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('ngOnInit should build form and call cargarLista()', () => {
        const cargarSpy = spyOn(component, 'cargarLista').and.callThrough();

        fixture.detectChanges();

        expect(component.crearForm).toBeTruthy();
        expect(component.nombreCrear).toBeTruthy();
        expect(cargarSpy).toHaveBeenCalled();
    });

    describe('cargarLista', () => {
        it('should call listar() when soloActivos = false', () => {
            component.soloActivos = false;

            component.cargarLista();

            expect(labServiceSpy.listar).toHaveBeenCalled();
            expect(labServiceSpy.listarActivos).not.toHaveBeenCalled();
            expect(component.cargandoLista).toBeFalse();
            expect(component.laboratorios).toEqual([]);
            expect(component.mensajeError).toBeNull();
        });

        it('should call listarActivos() when soloActivos = true', () => {
            const data = [{ idLaboratorio: 1, nombre: 'Lab 1', activo: 'S' }] as any[];
            labServiceSpy.listarActivos.and.returnValue(of(data));
            component.soloActivos = true;

            component.cargarLista();

            expect(labServiceSpy.listarActivos).toHaveBeenCalled();
            expect(labServiceSpy.listar).not.toHaveBeenCalled();
            expect(component.cargandoLista).toBeFalse();
            expect(component.laboratorios).toEqual(data as any);
            expect(component.mensajeError).toBeNull();
        });

        it('should set mensajeError on error', () => {
            labServiceSpy.listar.and.returnValue(throwError(() => new Error('boom')));
            component.soloActivos = false;

            component.cargarLista();

            expect(component.cargandoLista).toBeFalse();
            expect(component.mensajeError).toBe('No se pudieron cargar los laboratorios.');
        });
    });

    it('toggleSoloActivos should invert flag and reload list', () => {
        const cargarSpy = spyOn(component, 'cargarLista').and.callThrough();
        component.soloActivos = false;

        component.toggleSoloActivos();

        expect(component.soloActivos).toBeTrue();
        expect(cargarSpy).toHaveBeenCalled();
    });

    describe('crear', () => {
        it('should mark touched and stop when form invalid', () => {
            fixture.detectChanges();
            component.crearForm.patchValue({ nombre: '' });

            const markSpy = spyOn(component.crearForm, 'markAllAsTouched').and.callThrough();

            component.crear();

            expect(markSpy).toHaveBeenCalled();
            expect(labServiceSpy.crear).not.toHaveBeenCalled();
            expect(component.creando).toBeFalse();
        });

        it('should call service, show success, reset form and reload list on success', () => {
            fixture.detectChanges();

            const cargarSpy = spyOn(component, 'cargarLista').and.callThrough();

            component.crearForm.patchValue({ nombre: '  Hematología  ' });

            component.crear();

            expect(component.creando).toBeFalse();
            expect(labServiceSpy.crear).toHaveBeenCalledWith({
                nombre: 'Hematología',
                activo: 'S',
            });

            expect(component.mensajeExito).toBe('Laboratorio creado correctamente.');
            expect(component.mensajeError).toBeNull();
            expect(component.crearForm.value.nombre).toBe('');
            expect(cargarSpy).toHaveBeenCalled();
        });

        it('should set mensajeError from backend message on error', () => {
            fixture.detectChanges();

            labServiceSpy.crear.and.returnValue(
                throwError(() => ({ error: { message: 'Ya existe' } })),
            );

            component.crearForm.patchValue({ nombre: 'Lab' });

            component.crear();

            expect(component.creando).toBeFalse();
            expect(component.mensajeExito).toBeNull();
            expect(component.mensajeError).toBe('Ya existe');
        });

        it('should set default mensajeError when backend message missing', () => {
            fixture.detectChanges();

            labServiceSpy.crear.and.returnValue(throwError(() => ({})));

            component.crearForm.patchValue({ nombre: 'Lab' });

            component.crear();

            expect(component.creando).toBeFalse();
            expect(component.mensajeError).toBe('No se pudo crear el laboratorio.');
        });
    });

    describe('toggleActivo', () => {
        it('should update lab.activo and set success message on success', () => {
            const lab: any = { idLaboratorio: 7, nombre: 'Microbiología', activo: 'N' };
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = true;
            const event = { target: input } as any;

            component.toggleActivo(lab, event);

            expect(labServiceSpy.actualizar).toHaveBeenCalledWith(7, {
                nombre: 'Microbiología',
                activo: 'S',
            });

            expect(lab.activo).toBe('S');
            expect(component.mensajeExito).toContain('activado');
            expect(component.mensajeError).toBeNull();
        });

        it('should refresh list if soloActivos=true and you deactivate (S->N)', () => {
            const cargarSpy = spyOn(component, 'cargarLista').and.callThrough();
            component.soloActivos = true;

            const lab: any = { idLaboratorio: 8, nombre: 'Química', activo: 'S' };
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = false;
            const event = { target: input } as any;

            component.toggleActivo(lab, event);

            expect(labServiceSpy.actualizar).toHaveBeenCalledWith(8, {
                nombre: 'Química',
                activo: 'N',
            });
            expect(lab.activo).toBe('N');
            expect(cargarSpy).toHaveBeenCalled();
        });

        it('should revert checkbox and set error message on error', () => {
            labServiceSpy.actualizar.and.returnValue(throwError(() => new Error('boom')));

            const lab: any = { idLaboratorio: 9, nombre: 'Imagenología', activo: 'S' };
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = false;
            const event = { target: input } as any;

            component.toggleActivo(lab, event);
            
            expect(input.checked).toBeTrue();
            expect(component.mensajeError).toBe('No se pudo actualizar el estado del laboratorio.');
            expect(component.mensajeExito).toBeNull();
        });
    });

    describe('eliminar', () => {
        it('should do nothing if confirm is false', () => {
            spyOn(window, 'confirm').and.returnValue(false);

            const lab: any = { idLaboratorio: 10, nombre: 'Patología', activo: 'S' };
            component.eliminar(lab);

            expect(labServiceSpy.eliminar).not.toHaveBeenCalled();
        });

        it('should call eliminar, set success and reload list on success', () => {
            spyOn(window, 'confirm').and.returnValue(true);
            const cargarSpy = spyOn(component, 'cargarLista').and.callThrough();

            const lab: any = { idLaboratorio: 11, nombre: 'Genética', activo: 'S' };
            component.eliminar(lab);

            expect(labServiceSpy.eliminar).toHaveBeenCalledWith(11);
            expect(component.mensajeExito).toContain('eliminado');
            expect(component.mensajeError).toBeNull();
            expect(cargarSpy).toHaveBeenCalled();
        });

        it('should set mensajeError from backend message on delete error', () => {
            spyOn(window, 'confirm').and.returnValue(true);

            labServiceSpy.eliminar.and.returnValue(
                throwError(() => ({ error: { message: 'No autorizado' } })),
            );

            const lab: any = { idLaboratorio: 12, nombre: 'Inmunología', activo: 'S' };
            component.eliminar(lab);

            expect(component.mensajeError).toBe('No autorizado');
            expect(component.mensajeExito).toBeNull();
        });

        it('should set default mensajeError on delete error without backend message', () => {
            spyOn(window, 'confirm').and.returnValue(true);

            labServiceSpy.eliminar.and.returnValue(throwError(() => ({})));

            const lab: any = { idLaboratorio: 13, nombre: 'Histo', activo: 'S' };
            component.eliminar(lab);

            expect(component.mensajeError).toBe('No se pudo eliminar el laboratorio.');
        });
    });

    describe('template (DOM)', () => {
        beforeEach(() => {           
            fixture.detectChanges();
        });

        it('should show success and error alerts when messages exist', () => {
            component.mensajeExito = 'OK!';
            component.mensajeError = 'ERROR!';
            fixture.detectChanges();

            const success = fixture.debugElement.query(By.css('.alert--success'))?.nativeElement as HTMLElement;
            const error = fixture.debugElement.query(By.css('.alert--error'))?.nativeElement as HTMLElement;

            expect(success?.textContent).toContain('OK!');
            expect(error?.textContent).toContain('ERROR!');
        });

        it('should show validation messages when nombre is touched and invalid', () => {            
            component.crearForm.patchValue({ nombre: '' });
            component.nombreCrear?.markAsTouched();
            fixture.detectChanges();

            const errBox = fixture.debugElement.query(By.css('.error-text'))?.nativeElement as HTMLElement;
            expect(errBox).toBeTruthy();
            expect(errBox.textContent).toContain('El nombre es obligatorio.');
        });

        it('toggle button text should change depending on soloActivos', () => {
            component.soloActivos = false;
            fixture.detectChanges();

            let btn = fixture.debugElement.query(By.css('.perfil-table-actions button'))!.nativeElement as HTMLButtonElement;
            expect(btn.textContent).toContain('Mostrar solo activos');

            component.soloActivos = true;
            fixture.detectChanges();

            btn = fixture.debugElement.query(By.css('.perfil-table-actions button'))!.nativeElement as HTMLButtonElement;
            expect(btn.textContent).toContain('Mostrar todos');
        });

        it('should render rows for laboratorios and show "No hay laboratorios" when empty', () => {            
            component.cargandoLista = false;
            component.laboratorios = [];
            fixture.detectChanges();

            const emptyRow = fixture.debugElement.query(By.css('.perfil-table-empty'))?.nativeElement as HTMLElement;
            expect(emptyRow).toBeTruthy();
            expect(emptyRow.textContent).toContain('No hay laboratorios para mostrar.');
            
            component.laboratorios = [
                { idLaboratorio: 1, nombre: 'BioLab', activo: 'S' } as any,
                { idLaboratorio: 2, nombre: 'Micro', activo: 'N' } as any,
            ];
            fixture.detectChanges();

            const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
            
            const emptyRow2 = fixture.debugElement.query(By.css('.perfil-table-empty'));
            expect(emptyRow2).toBeNull();
            
            expect(rows.length).toBe(2);

            const firstRowText = rows[0].nativeElement.textContent as string;
            expect(firstRowText).toContain('1');
            expect(firstRowText).toContain('BioLab');
        });

        it('clicking "Mostrar solo activos" should call toggleSoloActivos()', () => {
            const spy = spyOn(component, 'toggleSoloActivos').and.callThrough();

            const btn = fixture.debugElement.query(By.css('.perfil-table-actions button'));
            btn!.triggerEventHandler('click', new MouseEvent('click'));
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });

        it('changing the switch should call toggleActivo(l, $event)', () => {
            component.laboratorios = [{ idLaboratorio: 1, nombre: 'BioLab', activo: 'S' } as any];
            fixture.detectChanges();

            const spy = spyOn(component, 'toggleActivo').and.callThrough();

            const checkboxDe = fixture.debugElement.query(By.css('tbody tr .switch input[type="checkbox"]'));
            expect(checkboxDe).toBeTruthy();

            const checkbox = checkboxDe!.nativeElement as HTMLInputElement;
            checkbox.checked = false;
            checkboxDe!.triggerEventHandler('change', { target: checkbox });

            expect(spy).toHaveBeenCalled();            
            expect(spy.calls.mostRecent().args[0].idLaboratorio).toBe(1);
        });
    });

});
