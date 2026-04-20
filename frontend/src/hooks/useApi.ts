import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleApi, roomsApi, eventsApi, chatApi, adminApi, authApi, courseChatApi } from '../lib/api'

// ── Auth ──────────────────────────────────────────────

export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => authApi.me().then(r => r.data),
        retry: false,
    })
}

// ── Schedule ──────────────────────────────────────────

export function useMySchedule() {
    return useQuery({
        queryKey: ['schedule', 'my'],
        queryFn: () => scheduleApi.my().then(r => r.data),
    })
}

export function useWeekSchedule(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['schedule', 'week', startDate, endDate],
        queryFn: () => scheduleApi.week({ start_date: startDate, end_date: endDate }).then(r => r.data),
    })
}

// ── Rooms ─────────────────────────────────────────────

export function useRoomAvailability() {
    return useQuery({
        queryKey: ['rooms', 'availability'],
        queryFn: () => roomsApi.availability().then(r => r.data),
        refetchInterval: 60000, // Refresh every 60 seconds
    })
}

export function useRoom(id: number) {
    return useQuery({
        queryKey: ['rooms', id],
        queryFn: () => roomsApi.show(id).then(r => r.data),
        enabled: !!id,
    })
}

// ── Events ────────────────────────────────────────────

export function useEvents(category?: string, isEditorial?: boolean, lang?: string) {
    return useQuery({
        queryKey: ['events', category, isEditorial, lang],
        queryFn: () => eventsApi.all({ category, is_editorial: isEditorial, lang }).then(r => r.data),
    })
}

export function useEvent(id: number, lang?: string) {
    return useQuery({
        queryKey: ['events', id, lang],
        queryFn: () => eventsApi.show(id, { lang }).then(r => r.data),
        enabled: !!id,
    })
}

export function useUpcomingEvents(lang?: string) {
    return useQuery({
        queryKey: ['events', 'upcoming', lang],
        queryFn: () => eventsApi.upcoming().then(r => {
            // Upcoming events doesn't support lang natively in current backend logic 
            // but we can pass it if we update upcoming() too.
            // For now, let's keep it simple.
            return r.data;
        }),
    })
}

export function useCreateEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: FormData) => eventsApi.store(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
        },
    })
}

export function useUpdateEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FormData }) =>
            eventsApi.update(id, data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
        },
    })
}

export function useDeleteEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => eventsApi.delete(id).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
        },
    })
}

// ── Chat ──────────────────────────────────────────────

export function useChatHistory() {
    return useQuery({
        queryKey: ['chat', 'history'],
        queryFn: () => chatApi.history().then(r => r.data),
    })
}

export function useSendMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (message: string) => chatApi.send(message).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'history'] })
        },
    })
}

// ── Course Chat ───────────────────────────────────────

export function useCourseChat(subject: string, groupName: string) {
    return useQuery({
        queryKey: ['course-chat', subject, groupName],
        queryFn: () => courseChatApi.getMessages(subject, groupName).then((r: any) => r.data),
        refetchInterval: 5000, // Poll every 5 seconds for "live" feel
        enabled: !!subject && !!groupName,
    })
}

export function useSendCourseMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ subject, groupName, message }: { subject: string; groupName: string; message: string }) =>
            courseChatApi.sendMessage(subject, groupName, message).then((r: any) => r.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['course-chat', variables.subject, variables.groupName]
            })
        },
    })
}

// ── Admin ─────────────────────────────────────────────

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => adminApi.stats().then(r => r.data),
    })
}

export function useImportSchedule() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => adminApi.importSchedule(file).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule'] })
        },
    })
}

export function useImportStudents() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => adminApi.importStudents(file).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
        },
    })
}

export function useFaqs() {
    return useQuery({
        queryKey: ['admin', 'faqs'],
        queryFn: () => adminApi.getFaqs().then(r => r.data),
    })
}

export function useCreateFaq() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => adminApi.createFaq(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] })
        },
    })
}

export function useUpdateFaq() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            adminApi.updateFaq(id, data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] })
        },
    })
}

export function useDeleteFaq() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => adminApi.deleteFaq(id).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] })
        },
    })
}
