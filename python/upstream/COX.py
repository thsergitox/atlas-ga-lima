import numpy as np


def _ismember_loc(a, b):
    """Return the 0-based position in b of each element of a (MATLAB ismember)."""
    b = np.asarray(b)
    return np.array([np.flatnonzero(b == v)[0] for v in a], dtype=int)


def COX(p1, p2):
    """Crossover operator (MATLAB: COX.m).

    The middle segment [cp1+1, cp2] (1-based) is inherited from the parent,
    while the outer segments are reordered following the order of the other
    parent.
    """
    p1 = np.asarray(p1)
    p2 = np.asarray(p2)
    x1 = p1.copy()
    x2 = p2.copy()
    n = x1.size

    # Generate two random crossover points (1-based, inclusive like randi)
    cp1 = np.random.randint(2, n - 2 + 1)
    cp2 = np.random.randint(cp1 + 1, n - 1 + 1)

    # Subsets: x(1:cp1) and x(cp2+1:end)
    subset11 = x1[:cp1]
    subset12 = x1[cp2:]
    subset21 = x2[:cp1]
    subset22 = x2[cp2:]

    # find indices of subset in both rows
    idx11_1 = _ismember_loc(subset11, p1)
    idx11_2 = _ismember_loc(subset11, p2)

    idx12_1 = _ismember_loc(subset12, p1)
    idx12_2 = _ismember_loc(subset12, p2)

    idx21_1 = _ismember_loc(subset21, p1)
    idx21_2 = _ismember_loc(subset21, p2)

    idx22_1 = _ismember_loc(subset22, p1)
    idx22_2 = _ismember_loc(subset22, p2)

    # reordering
    x1[idx11_1] = p2[np.sort(idx11_2)]
    x1[idx12_1] = p2[np.sort(idx12_2)]
    x2[idx21_2] = p1[np.sort(idx21_1)]
    x2[idx22_2] = p1[np.sort(idx22_1)]

    # Put the reordered segments together
    y1 = np.concatenate([x1[:cp1], p1[cp1:cp2], x1[cp2:]])
    y2 = np.concatenate([x2[:cp1], p2[cp1:cp2], x2[cp2:]])

    return y1, y2
