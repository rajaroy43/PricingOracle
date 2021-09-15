import numpy as np
import math

def comb(n, m):
    return math.factorial(n) / (math.factorial(m) * math.factorial(n - m))

def dmi2(A1, B1, A2, B2, C):
    def check(x):
        return 0 <= x and x < C and type(x) == np.int64

    def GetM(A, B):
        assert(len(A) == len(B))
        M = np.zeros((C, C))
        for (x, y) in zip(A, B):
            if check(x) and check(y):
                M[x][y] += 1
            else:
                raise ValueError('The values of answers must be integers in [0, C)')
        return M

    M1 = GetM(A1, B1)
    M2 = GetM(A2, B2)

    return np.linalg.det(M1) * np.linalg.det(M2)


def DMI(answers, choice_n, use_norm = True, shuffle = False):
    # takes np array of answers, number of choices and flag to calculate 
    # normalization of payments and a flag to shuffle the array or not.  
    # If shuffle = False, the array should be pre-shuffled.  
    # This can be helpful when carrying wisdom node ids
    if type(answers) == list:
        answers = np.array(answers)
    agent_n, task_n = answers.shape

    print("\nUsing agent_n: ",agent_n, " and task_n: ", task_n)

    # T >= 2C; N > 1;
    if task_n < 2 * choice_n:
        raise ValueError('Insufficient number of tasks.')
    if agent_n <= 1:
        raise ValueError('Too few agents.')
    # T tasks are arbitrarily divided into two disjoint parts T_1 , T_2
    answers = np.transpose(answers)
    if shuffle: np.random.shuffle(answers)  # making this optional so we can assign worker ids if they aren't included.
    half = task_n // 2
    T1 = np.transpose(answers[ : half])
    T2 = np.transpose(answers[half : ])

    # Calculate the payment

    payments = []
    norm_factor = (agent_n - 1) * (math.factorial(choice_n) ** 2)
    norm_factor *= comb(T1.shape[0], choice_n) * comb(T2.shape[0], choice_n)
    #print("\nNormalization Factor is: ", norm_factor, "and will", ('' if use_norm else ' not'), " be used.")
    for i in range(agent_n):
        p = 0
        for j in range(agent_n):
            if i == j: continue
            p += dmi2(T1[i], T1[j], T2[i], T2[j], choice_n)
            #print("p i j", p,i,j)
        if use_norm: p /= norm_factor
        if p<0: print('p less than zero ',i,p)
        payments.append(p)

    return np.array([payments]).T, norm_factor
