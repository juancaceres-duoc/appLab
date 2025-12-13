import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Perfil } from './perfil';
import { UsuarioService } from '../../services/usuario';

describe('Perfil', () => {
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj<UsuarioService>('UsuarioService', ['listar', 'actualizarPorRut']);

    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [{ provide: UsuarioService, useValue: usuarioServiceSpy }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Perfil);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ngOnInit should call cargarUsuarios()', () => {
    usuarioServiceSpy.listar.and.returnValue(of([]));
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    const spy = spyOn(comp, 'cargarUsuarios').and.callThrough();
    comp.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('cargarUsuarios should populate usuarios on success', () => {
    const lista: any[] = [{ rut: '1-9', nombre: 'A', correo: 'a@a.cl', rol: 'ADMIN' }];
    usuarioServiceSpy.listar.and.returnValue(of(lista as any));

    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.cargarUsuarios();

    expect(comp.cargandoLista).toBeFalse();
    expect(comp.usuarios).toEqual(lista as any);
    expect(comp.mensajeError).toBeNull();
  });

  it('cargarUsuarios should set mensajeError on error', () => {
    usuarioServiceSpy.listar.and.returnValue(throwError(() => new Error('boom')));

    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.cargarUsuarios();

    expect(comp.cargandoLista).toBeFalse();
    expect(comp.mensajeError).toBe('Error al cargar la lista de usuarios.');
  });

  it('seleccionarUsuario should set seleccionado and reset form with user values', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    const usuario: any = { rut: '12345678-9', nombre: 'Juan', correo: 'juan@duoc.cl', rol: 'ADMIN' };

    comp.mensajeExito = 'ok';
    comp.mensajeError = 'err';

    comp.seleccionarUsuario(usuario);

    expect(comp.seleccionado).toEqual(usuario);
    expect(comp.mensajeExito).toBeNull();
    expect(comp.mensajeError).toBeNull();
    expect(comp.editForm.value.nombre).toBe(usuario.nombre);
    expect(comp.editForm.value.correo).toBe(usuario.correo);
    expect(comp.editForm.value.rol).toBe(usuario.rol);
    expect(comp.editForm.value.password).toBe('');
  });

  it('cancelarEdicion should clear seleccionado, reset form and messages', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.seleccionado = { rut: '1-9' } as any;
    comp.mensajeExito = 'ok';
    comp.mensajeError = 'err';
    comp.editForm.patchValue({ nombre: 'X', correo: 'x@x.cl', rol: 'ADMIN', password: 'Passw0rd!' });

    comp.cancelarEdicion();

    expect(comp.seleccionado).toBeNull();
    expect(comp.mensajeExito).toBeNull();
    expect(comp.mensajeError).toBeNull();
    expect(comp.editForm.value).toEqual({ nombre: null, correo: null, rol: null, password: null });
  });

  it('guardarCambios should set error when no seleccionado', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.seleccionado = null;

    comp.guardarCambios();

    expect(comp.mensajeError).toBe('No hay usuario seleccionado.');
    expect(usuarioServiceSpy.actualizarPorRut).not.toHaveBeenCalled();
  });

  it('guardarCambios should markAllAsTouched when form invalid', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.seleccionado = { rut: '12345678-9', nombre: 'A', correo: 'a@a.cl', rol: 'ADMIN' } as any;

    // Make invalid: required nombre/correo/rol
    comp.editForm.patchValue({ nombre: '', correo: 'bad', rol: '' });
    const markSpy = spyOn(comp.editForm, 'markAllAsTouched').and.callThrough();

    comp.guardarCambios();

    expect(markSpy).toHaveBeenCalled();
    expect(usuarioServiceSpy.actualizarPorRut).not.toHaveBeenCalled();
  });

  it('guardarCambios should call actualizarPorRut and update usuarios list on success (without password)', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    const selected: any = { rut: '12345678-9', nombre: 'Old', correo: 'old@a.cl', rol: 'ADMIN' };
    const updatedResp: any = { rut: '12345678-9', nombre: 'New', correo: 'new@a.cl', rol: 'TECNICO' };

    comp.usuarios = [selected];
    comp.seleccionado = selected;

    comp.editForm.setValue({ nombre: 'New', correo: 'new@a.cl', rol: 'TECNICO', password: '' });

    usuarioServiceSpy.actualizarPorRut.and.returnValue(of(updatedResp));

    comp.guardarCambios();

    expect(usuarioServiceSpy.actualizarPorRut).toHaveBeenCalled();
    const call = usuarioServiceSpy.actualizarPorRut.calls.mostRecent().args;
    expect(call[0]).toBe(selected.rut);

    // password should not be set when empty
    expect((call[1] as any).password).toBeUndefined();

    expect(comp.guardando).toBeFalse();
    expect(comp.mensajeExito).toBe('Usuario actualizado correctamente.');
    expect(comp.usuarios[0]).toEqual(updatedResp);
  });

  it('guardarCambios should include password when provided', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    const selected: any = { rut: '12345678-9', nombre: 'Old', correo: 'old@a.cl', rol: 'ADMIN' };
    comp.seleccionado = selected;
    comp.usuarios = [selected];

    comp.editForm.setValue({ nombre: 'Old', correo: 'old@a.cl', rol: 'ADMIN', password: 'NewPass1' });
    usuarioServiceSpy.actualizarPorRut.and.returnValue(of({ ...selected } as any));

    comp.guardarCambios();

    const call = usuarioServiceSpy.actualizarPorRut.calls.mostRecent().args;
    expect((call[1] as any).password).toBe('NewPass1');
  });

  it('guardarCambios should set mensajeError on update error', () => {
    const fixture = TestBed.createComponent(Perfil);
    const comp = fixture.componentInstance;

    comp.seleccionado = { rut: '12345678-9', nombre: 'A', correo: 'a@a.cl', rol: 'ADMIN' } as any;
    comp.editForm.setValue({ nombre: 'Aaa', correo: 'a@a.cl', rol: 'ADMIN', password: '' });

    usuarioServiceSpy.actualizarPorRut.and.returnValue(throwError(() => new Error('boom')));

    comp.guardarCambios();

    expect(comp.guardando).toBeFalse();
    expect(comp.mensajeError).toBe('Ocurrió un error al actualizar el usuario.');
  });
});
