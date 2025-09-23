import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, loginUser } from "../Services/userService";
import { LoginForm } from "../Models/loginModel";

export const useUser = () => {
    
    const queryClient = useQueryClient();

    // Mutation para CREAR/REGISTRAR usuario
    const registerMutation = useMutation({
        mutationFn: (data: LoginForm) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            console.log("Usuario registrado exitosamente");
        },
        onError: (error) => {
            console.error("Error al registrar el usuario:", error);
        },
    });

    // Mutation para HACER LOGIN
    const loginMutation = useMutation({
        mutationFn: (data: LoginForm) => loginUser(data),
        onSuccess: (userData) => {
            console.log("✅ Login exitoso:", userData);
            
            // Debug: Verificar cookies después del login
            setTimeout(() => {
                import('../../Utils/Cookies').then(({ cookieUtils }) => {
                    cookieUtils.debugCookies();
                });
            }, 100);
        },
        onError: (error) => {
            console.error("Error al hacer login:", error);
        },
    });

    return {
        // Mutation para registro
        registerMutation,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        // Mutation para login
        loginMutation,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        // Mantener compatibilidad con el código anterior
        createMutation: registerMutation, // Para compatibilidad
        isCreating: registerMutation.isPending,
        createError: registerMutation.error,
    };
}