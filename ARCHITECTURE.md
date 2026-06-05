# Architecture Documentation

## Core Stack

TanStack Start + TanStack Router provides SSR-capable file-based routing. TanStack Query handles server state. shadcn/ui (Radix primitives + CVA) provides the component system.

```mermaid
graph TD
    Router[TanStack Router] --> Routes[Route Files in src/]
    Routes --> Components[shadcn/ui Components]
    Components --> Query[TanStack Query]
    Query --> API[API / Data Layer]
```

---

**By OutLawZ™** | https://www.brandex.pk | net2tara@gmail.com
