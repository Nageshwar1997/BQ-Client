# BQ-Client

## Component Order Format

```
const Component = () => {
  // 1. External hooks (library / global)
  const setUser = useUserStore((s) => s.setUser);

  // 2. Custom hooks
  const manualLoginQuery = useManualLogin();

  // 3. Local state
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 4. Derived values / variables
  const isLoading = manualLoginQuery.isPending;

  // 5. Handlers / functions
  const handleSubmit = () => {};
  const togglePassword = () => setShowPassword((prev) => !prev);

  // 6. Effects
  useEffect(() => {
    if (manualLoginQuery.data) {
      setUser(manualLoginQuery.data);
    }
  }, [manualLoginQuery.data, setUser]);

  // 7. JSX
  return <div>...</div>;
};
```