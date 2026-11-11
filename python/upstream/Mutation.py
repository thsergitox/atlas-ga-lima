import numpy as np


def Mutation(x, mu):
    """Swap mutation (MATLAB: Mutation.m).

    Faithful to the original: ``flag = (rand(n) < mu)`` builds an n-by-n
    matrix and ``if flag(i,:) == 1`` is true only when the WHOLE row i is 1,
    i.e. each swap happens with probability mu**n. The first place is never
    moved.
    """
    x = np.array(x, copy=True)
    n = x.size
    flag = np.random.rand(n, n) < mu
    # MATLAB i = 2:n-1 (1-based) -> Python i = 1..n-2 (0-based)
    for i in range(1, n - 1):
        if np.all(flag[i, :] == 1):
            temp = x[i]
            x[i] = x[i + 1]
            x[i + 1] = temp
    y = x
    return y
