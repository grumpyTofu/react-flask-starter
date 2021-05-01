from types import MappingProxyType

permissions = MappingProxyType({
    'user': 1,
    'super_user': 2,
    'admin': 3
})

reverse_permissions = {v: k for k, v in permissions.items()}

def reverse_lookup(id: int):
    return reverse_permissions[id]